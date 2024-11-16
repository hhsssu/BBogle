# import boto3
# import json
# from botocore.config import Config
# from fastapi import HTTPException
# import logging
#
# logger = logging.getLogger(__name__)
#
# class DevLogSummaryService:
#     def __init__(self, settings):
#         try:
#             # AWS 세션 및 클라이언트 설정
#             session = boto3.Session(
#                 aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
#                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
#                 region_name=settings.AWS_REGION
#             )
#
#             config = Config(
#                 retries={"max_attempts": 3, "mode": "adaptive"}
#             )
#
#             self.client = session.client(
#                 "bedrock-runtime",
#                 config=config
#             )
#
#             self.model_id = "anthropic.claude-3-haiku-20240307-v1:0"
#             logger.info("Bedrock 클라이언트 초기화 성공!")
#
#             # 세션과 클라이언트 설정이 성공적으로 완료되었는지 확인
#             logger.info(f"AWS 세션 설정 성공: {session}")
#             logger.info(f"Bedrock 클라이언트 설정 성공: {self.client}")
#
#         except Exception as e:
#             logger.error(f"Bedrock 클라이언트 초기화 실패: {e}")
#             raise
#
#     async def generate_summary(self, qna_list: list) -> str:
#         try:
#             # AWS 클라이언트가 None인지 확인하는 로그
#             if not self.client:
#                 logger.error("AWS 클라이언트가 제대로 초기화되지 않았습니다.")
#                 raise HTTPException(
#                     status_code=500,
#                     detail="AWS 클라이언트 초기화 오류"
#                 )
#
#             # QnA 리스트를 문자열로 변환하여 프롬프트 생성
#             prompt = self._create_prompt(qna_list)
#
#             # 메시지 구성
#             messages = [
#                 {
#                     "role": "user",
#                     "content": prompt
#                 }
#             ]
#
#             # 요청 페이로드
#             payload = {
#                 "anthropic_version": "bedrock-2023-05-31",
#                 "max_tokens": 1000,
#                 "messages": messages
#             }
#
#             # 모델 호출
#             response = self.client.invoke_model(
#                 modelId=self.model_id,
#                 contentType="application/json",
#                 accept="application/json",
#                 body=json.dumps(payload)
#             )
#
#             result = self._process_response(response)
#             return result["title"]
#
#         except self.client.exceptions.ThrottlingException:
#             logger.error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.")
#             raise HTTPException(
#                 status_code=429,
#                 detail="요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
#             )
#         except Exception as e:
#             logger.error(f"서버에서 발생한 에러: {str(e)}")
#             raise HTTPException(
#                 status_code=500,
#                 detail="서버에서 예기치 못한 에러가 발생했습니다."
#             )
#
#     def _create_prompt(self, qna_list: list) -> str:
#         qna_text = "\n\n".join([
#             f"[질문]\n{item['question']}\n\n[답변]\n{item['answer']}"
#             for item in qna_list
#         ])
#
#         return f"""
#         다음 개발일지 내용을 50자 이내의 한 줄 제목으로 요약해주세요:
#
#         {qna_text}
#         """
#
#     def _process_response(self, response: dict) -> dict:
#         try:
#             result = json.loads(response['body'].read().decode("utf-8"))
#             title = result.get('content', [{}])[0].get('text', "")
#
#             return {
#                 "title": title.strip()
#             }
#
#         except Exception as e:
#             logger.error(f"응답 처리 중 에러 발생: {e}")
#             raise HTTPException(
#                 status_code=500,
#                 detail="모델 응답 처리 실패"
#             )
import boto3
import json
import re
import time
from botocore.config import Config
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)


class DevLogSummaryService:
    def __init__(self, settings):
        try:
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
            logger.info(f"AWS 세션 설정 성공: {session}")
            logger.info(f"Bedrock 클라이언트 설정 성공: {self.client}")

        except Exception as e:
            logger.error(f"Bedrock 클라이언트 초기화 실패: {e}")
            raise

    def clean_response(self, text: str, max_length: int = 30) -> str:
        """응답을 정제하는 헬퍼 함수"""
        # 여러 줄이 있는 경우 첫 줄만 선택
        first_line = text.strip().split('\n')[0]

        # 숫자로 시작하는 경우 제거
        text = re.sub(r'^\d+\.?\s*', '', first_line)
        # 영문자 제거 (한글과 숫자만 유지)
        text = re.sub('[a-zA-Z]', '', text)
        # 특수문자 제거 (쉼표와 공백은 허용)
        text = re.sub(r'[-=+#/\?:^$.@*\"※~&%ㆍ!』\|\(\)\[\]\<\>`\'…》]', '', text)
        # 마침표 제거
        text = text.replace('.', '')
        # 연속된 공백 제거
        text = re.sub(r'\s+', ' ', text)

        # 길이 제한 적용 시 자연스러운 끝부분 찾기
        if len(text) > max_length:
            truncated = text[:max_length]
            last_comma = truncated.rfind(',')
            if last_comma != -1 and last_comma > max_length * 0.5:
                text = text[:last_comma].strip()
            else:
                last_space = truncated.rfind(' ')
                if last_space != -1 and last_space > max_length * 0.5:
                    text = text[:last_space].strip()
                else:
                    text = truncated.strip()

        return text

    async def generate_summary(self, qna_list: list) -> str:
        try:
            if not self.client:
                logger.error("AWS 클라이언트가 제대로 초기화되지 않았습니다.")
                raise HTTPException(
                    status_code=500,
                    detail="AWS 클라이언트 초기화 오류"
                )

            start_time = time.time()
            prompt = self._create_prompt(qna_list)

            messages = [
                {
                    "role": "user",
                    "content": prompt
                }
            ]

            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 100,
                "messages": messages,
                "temperature": 0.1
            }

            response = self.client.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )

            result = self._process_response(response)

            # 응답 정제
            clean_title = self.clean_response(result["title"], max_length=35)

            end_time = time.time()
            execution_time = end_time - start_time
            logger.info(f"제목 생성 소요 시간: {execution_time:.2f}초")

            return clean_title

        except self.client.exceptions.ThrottlingException:
            logger.error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.")
            raise HTTPException(
                status_code=429,
                detail="요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
            )
        except Exception as e:
            logger.error(f"서버에서 발생한 에러: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="서버에서 예기치 못한 에러가 발생했습니다."
            )

    def _create_prompt(self, qna_list: list) -> str:
        qna_text = "\n\n".join([
            f"[질문]\n{item['question']}\n\n[답변]\n{item['answer']}"
            for item in qna_list
        ])

        return f"""
다음 규칙을 준수하여 위 개발일지 내용을 요약해주세요:
1. 30자 이내로 작성할 것
2. 주요 작업, 문제, 해결 과정을 포괄적으로 요약할 것
3. 각 작업과 이슈를 쉼표로 구분해 표현할 것
4. 제목이 개발일지 전체를 대표하도록 작성할 것

정확한 예시:
- 회고 설계 완료, API 호출 문제 해결
- FAST API 설계, 회고 로직 연결 성공
- 오류 해결, AWS 호출 문제 지원 완료

개발일지 내용:
{qna_text}
"""

    def _process_response(self, response: dict) -> dict:
        try:
            result = json.loads(response['body'].read().decode("utf-8"))

            if 'content' in result and isinstance(result['content'], list):
                for content_item in result['content']:
                    if content_item.get('type') == 'text':
                        return {
                            "title": content_item.get('text', "").strip()
                        }

            return {
                "title": "제목 생성 실패"
            }

        except Exception as e:
            logger.error(f"응답 처리 중 에러 발생: {e}")
            raise HTTPException(
                status_code=500,
                detail="모델 응답 처리 실패"
            )