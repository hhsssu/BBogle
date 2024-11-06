# app/services/devlog_summary_service.py
import boto3
import json
from botocore.config import Config
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class DevLogSummaryService:
   def __init__(self, settings):
       try:
           # AWS 세션 및 클라이언트 설정
           session = boto3.Session(
               aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
               aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
               region_name=settings.AWS_REGION
           )
           
           config = Config(
               retries={"max_attempts": 3, "mode": "adaptive"}
           )
           
           self.client = session.client(
               "bedrock-runtime",
               config=config
           )
           
           self.model_id = "anthropic.claude-3-haiku-20240307-v1:0"
           logger.info("Bedrock 클라이언트 초기화 성공!")
           
       except Exception as e:
           logger.error(f"Bedrock 클라이언트 초기화 실패: {e}")
           raise

   async def generate_summary(self, qna_list: list) -> str:
       try:
           # QnA 리스트를 문자열로 변환하여 프롬프트 생성
           prompt = self._create_prompt(qna_list)
           
           # 메시지 구성
           messages = [
               {
                   "role": "user",
                   "content": prompt
               }
           ]
           
           # 요청 페이로드
           payload = {
               "anthropic_version": "bedrock-2023-05-31",
               "max_tokens": 1000,
               "messages": messages
           }
           
           # 모델 호출
           response = self.client.invoke_model(
               modelId=self.model_id,
               contentType="application/json",
               accept="application/json",
               body=json.dumps(payload)
           )
           
           result = self._process_response(response)
           return result["title"]
           
       except self.client.exceptions.ThrottlingException:
           logger.error("요청이 너무 많습니다!")
           raise HTTPException(
               status_code=429,
               detail="잠시 후 다시 시도해주세요."
           )
       except Exception as e:
           logger.error(f"요약 생성 중 에러 발생: {e}")
           raise HTTPException(
               status_code=500,
               detail=str(e)
           )

   def _create_prompt(self, qna_list: list) -> str:
       # QnA 리스트를 문자열로 변환
       qna_text = "\n\n".join([
           f"[질문]\n{item['question']}\n\n[답변]\n{item['answer']}"
           for item in qna_list
       ])
       
       return f"""
       다음 개발일지 내용을 50자 이내의 한 줄 제목으로 요약해주세요:

       {qna_text}
       """

   def _process_response(self, response: dict) -> dict:
       try:
           result = json.loads(response['body'].read().decode("utf-8"))
           title = result.get('content', [{}])[0].get('text', "")
           
           return {
               "title": title.strip()
           }
           
       except Exception as e:
           logger.error(f"응답 처리 중 에러 발생: {e}")
           raise HTTPException(
               status_code=500,
               detail="모델 응답 처리 실패"
           )