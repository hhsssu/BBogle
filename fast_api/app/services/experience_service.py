import boto3
import json
import logging
from botocore.config import Config
from fastapi import HTTPException
from app.schemas.experience_schema import Keyword, ExtractedExperience, ExperienceResponse

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

    async def generate_experience(self, retrospective_content: str, keywords: list[Keyword]) -> ExperienceResponse:
        try:
            # 키워드 목록 생성
            keyword_list = ', '.join([f"{k.name}(id:{str(k.id)})" for k in keywords])

            # Prompt 생성
            prompt = f"""
            회고 내용을 분석하여 최대 4개의 핵심 경험을 추출하고, 각 경험에 적합한 **단일 키워드**를 매칭해주세요.

            [회고 내용]
            {retrospective_content}

            [사용 가능한 키워드 목록]
            {keyword_list}

            [작성 요구사항]
            1. 회고 내용에서 최대 4개의 핵심 경험 추출
            2. 각 경험별 필수 포함 요소:
               - 20자 이내의 요약된 제목
               - 담당한 구체적인 업무와 역할
               - 사용한 기술과 도구 명시
               - 정량적인 수치로 표현된 성과 (예: 30% 향상, 50% 단축 등)
               - 업무 수행을 통해 향상된 역량

            3. 각 경험에는 **하나의 키워드(ID와 이름)**만 매칭
            4. 다른 경험과 내용이 중복되지 않도록 작성

            [필수 규칙]
            - 각 경험은 300-700자의 하나의 문단으로 작성
            - 키워드는 반드시 하나씩만 포함
            - 구체적인 수치와 성과 반드시 포함
            - 추상적인 표현이나 일반적인 협업 내용 제외

            [출력 형식]
            {{
              "experiences": [
                {{
                  "title": "경험 1의 요약 제목 (20자 이내)",
                  "content": "경험 1의 내용 (300-700자)",
                  "keywords": [
                    {{"id": 1, "name": "키워드 1"}}
                  ]
                }},
                {{
                  "title": "경험 2의 요약 제목 (20자 이내)",
                  "content": "경험 2의 내용 (300-700자)",
                  "keywords": [
                    {{"id": 2, "name": "키워드 2"}}
                  ]
                }}
              ]
            }}
            """

            #             prompt = f"""
# 회고 내용을 분석하여 최대 4개의 핵심 경험을 추출하고, 각 경험에 적합한 키워드를 매칭해주세요.
#
# [회고 내용]
# {retrospective_content}
#
# [사용 가능한 키워드 목록]
# {keyword_list}
#
# [작성 요구사항]
# 1. 회고 내용에서 최대 4개의 핵심 경험 추출
# 2. 각 경험별 필수 포함 요소:
#    - 20자 이내의 요약된 제목
#    - 담당한 구체적인 업무와 역할
#    - 사용한 기술과 도구 명시
#    - 정량적인 수치로 표현된 성과 (예: 30% 향상, 50% 단축 등)
#    - 업무 수행을 통해 향상된 역량
#
# [필수 규칙]
# - 각 경험은 300-700자의 하나의 문단으로 작성
# - 경험별로 관련된 키워드 ID와 이름을 명시
# - 다른 경험과 내용이 중복되지 않도록 작성
# - 구체적인 수치와 성과 반드시 포함
# - 추상적인 표현이나 일반적인 협업 내용 제외
#
# [출력 형식]
# {{
#   "experiences": [
#     {{
#       "title": "경험 1의 요약 제목 (20자 이내)",
#       "content": "경험 1의 내용 (300-700자)",
#       "keywords": [
#         {{"id": 1, "name": "키워드 1"}},
#         {{"id": 2, "name": "키워드 2"}}
#       ]
#     }},
#     {{
#       "title": "경험 2의 요약 제목 (20자 이내)",
#       "content": "경험 2의 내용 (300-700자)",
#       "keywords": [
#         {{"id": 3, "name": "키워드 3"}},
#         {{"id": 4, "name": "키워드 4"}}
#       ]
#     }}
#   ]
# }}
# """
            logger.debug(f"최종 생성된 프롬프트: {prompt}")

            # Bedrock API 요청
            messages = [{"role": "user", "content": prompt}]
            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 2500,
                "messages": messages,
                "temperature": 0.5
            }

            response = self.client.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )

            response_body = json.loads(response['body'].read().decode("utf-8"))
            logger.info("Bedrock API 응답 수신 완료")

            if 'content' in response_body:
                content_data = response_body['content']

                # 로깅: 응답 데이터 타입 및 내용 확인
                logger.debug(f"'content' 데이터 타입: {type(content_data)}")
                logger.debug(f"'content' 데이터 내용: {content_data}")

                if isinstance(content_data, list) and len(content_data) > 0 and 'text' in content_data[0]:
                    # 'text' 필드에 포함된 JSON 문자열을 파싱
                    parsed_json = json.loads(content_data[0]['text'])

                    # 예상 구조에 따라 'experiences' 키 처리
                    if 'experiences' in parsed_json:
                        experiences_data = parsed_json['experiences']

                        # 각 경험 항목 검증 및 처리
                        experiences = []
                        for exp in experiences_data:
                            # 필요한 키 확인
                            if not all(key in exp for key in ('title', 'content', 'keywords')):
                                logger.error(f"경험 데이터 구조 오류: {exp}")
                                raise ValueError("경험 데이터에 필요한 키('title', 'content', 'keywords')가 누락되었습니다.")

                            experiences.append(
                                ExtractedExperience(
                                    title=exp['title'],
                                    content=exp['content'],
                                    keywords=exp['keywords']
                                )
                            )
                    else:
                        logger.error(f"'experiences' 키가 누락되었습니다: {parsed_json}")
                        raise ValueError("'experiences' 키가 누락되었습니다.")
                else:
                    logger.error(f"'content' 데이터 구조가 예상과 다릅니다: {content_data}")
                    raise ValueError("'content' 데이터 구조가 예상과 다릅니다.")

                return ExperienceResponse(experiences=experiences)
            else:
                logger.error("'content' 필드가 응답에 없습니다.")
                raise ValueError("'content' 필드가 응답에 없습니다.")

        except ValueError as e:
            logger.error(f"입력 데이터 오류 발생: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        except json.JSONDecodeError as e:
            logger.error(f"JSON 파싱 오류 발생: {e}")
            raise HTTPException(status_code=500, detail="경험 생성 중 JSON 파싱 오류가 발생했습니다.")
        except Exception as e:
            logger.error(f"경험 생성 중 예상치 못한 오류 발생: {e}")
            raise HTTPException(status_code=500, detail="경험 생성 중 오류가 발생했습니다.")