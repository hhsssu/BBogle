# app/services/experience_service.py
import boto3
import json
import logging
from botocore.config import Config
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class ExperienceService:
    def __init__(self, settings):
        try:
            session = boto3.Session(
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            config = Config(retries={"max_attempts": 3, "mode": "adaptive"})
            self.client = session.client("bedrock-runtime", config=config)
            self.model_id = "anthropic.claude-3-haiku-20240307-v1:0"
            logger.info("Bedrock 클라이언트 초기화 성공!")
        except Exception as e:
            logger.error(f"Bedrock 클라이언트 초기화 실패: {e}")
            raise

    async def generate_experience(self, retrospective_content: str, keywords: str) -> dict:
        prompt = f"""
        회고 내용을 분석하여 주어진 키워드 목록 중에서 실제 경험이 가장 뚜렷하게 드러나는 키워드만 선택하여 자기소개서 형식으로 작성해주세요.

        [회고 내용]
        {retrospective_content}

        [키워드 목록]
        {keywords}
        """
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000
        }
        
        try:
            response = self.client.invoke_model(
                modelId=self.model_id,
                body=json.dumps(payload),
                contentType="application/json",
                accept="application/json"
            )
            result = json.loads(response['body'].read().decode("utf-8"))
            experience_content = result.get('messages', [{}])[0].get('text', "").strip()
            return {"experience": experience_content}
        except Exception as e:
            logger.error(f"경험 생성 중 오류 발생: {e}")
            raise HTTPException(status_code=500, detail="경험 생성 실패")
