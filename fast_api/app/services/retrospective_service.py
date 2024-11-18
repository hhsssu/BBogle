# app/services/retrospective_service.py
import boto3
import json
import logging
from typing import List
from botocore.config import Config
from fastapi import HTTPException
from ..schemas.retrospective_schema import DailyLog

logger = logging.getLogger(__name__)

class RetrospectiveService:
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

    async def generate_retrospective(self, dev_logs: List[DailyLog]) -> str:
        try:
            # 프롬프트 생성
            prompt_parts = [
                """
                다음은 프로젝트 개발 기간 동안의 상세한 개발일지입니다.
                각 일자별로 진행된 작업, 발생한 문제, 해결 방안을 기록했습니다.
                이 내용을 바탕으로 프로젝트 회고록을 작성해주세요.

                [개발일지 목록]
                """
            ]
            
            for log in dev_logs:
                prompt_parts.append(f"\n날짜: {log.date}\n제목: {log.summary}\n\n[상세 내용]")
                for qa in log.daily_log:
                    prompt_parts.append(f"\n{qa.question}\n{qa.answer}")
            
            prompt_parts.append(
                """
                개발일지를 바탕으로 구체적이고 완성도 높은 프로젝트 회고록을 작성해주세요.
                각 섹션은 아래의 가이드라인을 참고하여 구체적 사례와 팀원 협업을 언급하고, 수치적 성과를 포함해주세요:

                1. [잘한 점 & 성과]
                - 프로젝트 기간 동안 성공적으로 달성된 작업 및 개선 사항
                - 주요 성과와 성과 수치(예: 비용 절감, 속도 향상 등)
                - 전체 시스템 아키텍처 개선 및 구현 사례

                2. [어려웠던 점 & 해결 과정]
                - 작업 중 발생한 구체적인 문제 상황과 해결을 위한 시도들
                - 문제를 극복하기 위한 대안 및 각 선택의 결과
                - 협업이 중요한 역할을 했던 사례 (예: Git 충돌 해결 등)

                3. [기술 스택 & 아키텍처]
                - 이번 프로젝트에서 활용한 주요 기술 스택 및 모델들
                - 시스템 아키텍처와 그로 인한 성능 개선
                - 보안 처리, 인증 방식, 데이터 처리 효율성 등

                5. 작성 지침
                - 글자 수 2000자 내외
                - 기술 용어는 개발일지에 기록된 그대로 사용
                """
            )
            
            prompt = "".join(prompt_parts)
            
            messages = [{"role": "user", "content": prompt}]
            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 2500,
                "messages": messages
            }
            
            response = self.client.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )
            return self._process_response(response)
        except Exception as e:
            logger.error(f"회고록 생성 중 오류 발생: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    def _process_response(self, response: dict) -> str:
        try:
            result = json.loads(response['body'].read().decode("utf-8"))
            return result.get('content', [{}])[0].get('text', "").strip()
        except Exception as e:
            logger.error(f"응답 처리 중 오류 발생: {e}")
            raise HTTPException(status_code=500, detail="모델 응답 처리 실패")
