from typing import List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import logging
import pika

from .services.devlog_summary_service import DevLogSummaryService
from .services.retrospective_service import RetrospectiveService
from .services.experience_service import ExperienceService
from .schemas.experience_schema import Keyword, ExperienceResponse, ExperienceRequest
from .schemas.retrospective_schema import DailyLog, RetrospectiveResponse
from .config import settings

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="개발일지 요약 및 경험 생성 서비스 API | ANSMOON 1.0.2",
    description="개발일지의 질문-답변을 분석하여 제목 및 회고 내용을 생성하고, 키워드 기반으로 경험을 추출하는 서비스입니다.",
    version="1.0.2",
    root_path="/ai",  # 모든 경로에 /ai 접두사 추가
    docs_url="/docs",
    redoc_url=None,
    openapi_url="/openapi.json",  # OpenAPI 경로 명시
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 초기화
summary_service = DevLogSummaryService(settings)
retrospective_service = RetrospectiveService(settings)
experience_service = ExperienceService(settings)

# RabbitMQ 연결 정보
rabbitmq_user = "bbogle"
rabbitmq_pass = "ayebimil"
rabbitmq_host = "bbogle-rabbitmq"  # Docker 컨테이너 이름 또는 호스트
rabbitmq_port = 5672
rabbitmq_exchange = ""

# RabbitMQ 연결 및 채널 설정
connection_parameters = pika.ConnectionParameters(
    host=rabbitmq_host,
    port=rabbitmq_port,
    credentials=pika.PlainCredentials(rabbitmq_user, rabbitmq_pass),
    heartbeat=600,  # heartbeat 설정 (초 단위)
    blocked_connection_timeout=300,
)
connection = pika.BlockingConnection(connection_parameters)
channel = connection.channel()

# 큐 선언
channel.queue_declare(queue='summaryQueue', durable=True)
channel.queue_declare(queue='retrospectiveQueue', durable=True)
channel.queue_declare(queue='experienceQueue', durable=True)
channel.queue_declare(queue='responseQueue', durable=True)


def send_response(queue: str, correlation_id: str, response_body: dict):
    """
    RabbitMQ로 응답을 전송하는 헬퍼 함수
    """
    channel.basic_publish(
        exchange=rabbitmq_exchange,
        routing_key=queue,
        body=json.dumps(response_body),
        properties=pika.BasicProperties(
            correlation_id=correlation_id,
            content_type='application/json',
            delivery_mode=2  # 메시지를 디스크에 저장 (영구적)
        )
    )


# 메시지 소비 함수들
def on_title_queue_message(ch, method, properties, body):
    """
    titleQueue에서 메시지를 소비하는 콜백 함수
    """
    try:
        data = json.loads(body)
        logger.info("titleQueue 메시지 수신: %s", data)
        if not data.get("data"):
            raise ValueError("요약 생성에 필요한 데이터가 없습니다.")

        # summary_service를 사용하여 요약 생성
        result = asyncio.run(summary_service.generate_summary(data["data"]))  # 서비스는 async 함수로 가정

        # 응답 전송
        response = {
            "type": "title_response",
            "result": result
        }
        channel.basic_publish(
            exchange='',
            routing_key=properties.reply_to,
            body=json.dumps(response),
            properties=pika.BasicProperties(
                correlation_id=properties.correlation_id),
        )
        logger.info("titleQueue 응답 전송: %s", response)
    except Exception as e:
        logger.error(f"titleQueue 처리 중 오류 발생: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)


def on_retrospective_queue_message(ch, method, properties, body):
    """
    retrospectiveQueue에서 메시지를 소비하는 콜백 함수
    """
    try:
        data = json.loads(body)
        logger.info("retrospectiveQueue 메시지 수신: %s", data)
        if not data.get("data"):
            raise ValueError("회고록 생성에 필요한 데이터가 없습니다.")

        # Pydantic 모델 변환
        # data["data"]는 List[dict] 형식이므로, 이를 List[DailyLog]로 변환합니다.
        daily_logs = [DailyLog(**item) for item in data["data"]]

        # retrospective_service를 사용하여 회고록 생성
        result = asyncio.run(retrospective_service.generate_retrospective(daily_logs))  # 서비스는 async 함수로 가정
        # 응답 전송
        # response = {
        #     "type": "retrospective_response",
        #     "result": result
        # }
        response = {
            "retrospective": result
        }
        ch.basic_publish(
            exchange='',
            routing_key=properties.reply_to,
            body=json.dumps(response, ensure_ascii=False),
            properties=pika.BasicProperties(
                correlation_id=properties.correlation_id,
                content_type='application/json'
            ),
        )
        # send_response("responseQueue", properties.correlation_id, response)
        logger.info("retrospectiveQueue 응답 전송: %s", response)
    except Exception as e:
        logger.error(f"retrospectiveQueue 처리 중 오류 발생: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)


# def on_experience_queue_message(ch, method, properties, body):
#     """
#     experienceQueue에서 메시지를 소비하는 콜백 함수
#     """
#     try:
#         data = json.loads(body)
#         logger.info("experienceQueue 메시지 수신: %s", data)
#         if not data.get("data"):
#             raise ValueError("경험 생성에 필요한 데이터가 없습니다.")
#
#         # experience_service를 사용하여 경험 생성
#         retrospective_content = data["data"].get("retrospective_content", "")
#         keywords = data["data"].get("keywords", "")
#         result = asyncio.run(experience_service.generate_experience(retrospective_content, keywords))  # 서비스는 async 함수로 가정
#
#         # 응답 전송
#         response = {
#             "type": "experience_response",
#             "result": result
#         }
#         send_response("responseQueue", properties.correlation_id, response)
#         logger.info("experienceQueue 응답 전송: %s", response)
#     except Exception as e:
#         logger.error(f"experienceQueue 처리 중 오류 발생: {e}")
#     finally:
#         ch.basic_ack(delivery_tag=method.delivery_tag)

def on_experience_queue_message(ch, method, properties, body):
    """
    experienceQueue에서 메시지를 소비하는 콜백 함수
    """
    try:
        data = json.loads(body)
        logger.info("experienceQueue 메시지 수신: %s", data)
        if not data.get("data"):
            raise ValueError("경험 생성에 필요한 데이터가 없습니다.")

        # experience_service를 사용하여 경험 생성
        # retrospective_content = data["data"].get("retrospective_content", "")

        # 데이터 파싱
        # keywords = data["data"].get("keywords", [])
        # result = asyncio.run(experience_service.generate_experience(retrospective_content, keywords))  # 서비스는 async 함수로 가정
        retrospective_content = data["data"].get("retrospective_content", "")
        keywords_data = data["data"].get("keywords", [])

        # 키워드를 Pydantic 모델로 변환
        from .schemas.experience_schema import Keyword as KeywordModel
        keywords = [KeywordModel(**kw) for kw in keywords_data]

        # experience_service를 사용하여 경험 생성
        result = asyncio.run(experience_service.generate_experience(retrospective_content, keywords))  # async 함수로 가정

        # 응답 전송
        # response = {
        #     # "type": "experience_response",
        #     "experiences": result.dict() if hasattr(result, "dict") else result
        # }
        response = result.dict()
        ch.basic_publish(
            exchange='',
            routing_key=properties.reply_to,
            body=json.dumps(response, ensure_ascii=False),
            properties=pika.BasicProperties(
                correlation_id=properties.correlation_id,
                content_type='application/json'
            ),
        )
        logger.info("experienceQueue 응답 전송: %s", response)
    except Exception as e:
        logger.error(f"experienceQueue 처리 중 오류 발생: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)


# RabbitMQ 소비자 설정
channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='titleQueue', on_message_callback=on_title_queue_message)
channel.basic_consume(queue='retrospectiveQueue', on_message_callback=on_retrospective_queue_message)
channel.basic_consume(queue='experienceQueue', on_message_callback=on_experience_queue_message)


@app.on_event("startup")
async def startup():
    """
    FastAPI 애플리케이션이 시작될 때 RabbitMQ 소비를 시작
    """
    logger.info("RabbitMQ 메시지 소비 시작")
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, channel.start_consuming)


@app.on_event("shutdown")
def shutdown():
    """
    애플리케이션 종료 시 RabbitMQ 연결 종료
    """
    logger.info("애플리케이션 종료 - RabbitMQ 연결 종료")
    if connection.is_open:
        connection.close()


# 기존 API 엔드포인트 복원 및 유지

@app.post(
        "/generate/title",
    response_model=dict,
    summary="개발일지 제목 생성",
    description="""개발일지의 질문-답변 리스트를 받아 적절한 제목을 생성합니다.
    
입력/출력 형식
- 입력: 질문과 답변의 리스트 (JSON)
- 출력: 50자 이내의 요약된 제목

요청 예시:
[
    {"question": "오늘 수행한 작업은 무엇인가요?", "answer": "사이드바 상태관리 수정과 공통 컴포넌트 구현"},
    {"question": "어려웠던 점은 무엇인가요?", "answer": "모달 컴포넌트 설계 시 고려사항이 많았음"}
]

응답 예시:
{"title": "사이드바 상태관리 및 모달 컴포넌트 구현"}

주의사항
- 모든 질문에 답변이 필요합니다.
- 빈 리스트는 허용되지 않습니다.""",
    response_description="생성된 개발일지 제목"
)
async def summarize_devlog(qna_list: List[dict] = Body(...)):
    logger.info("개발일지 제목 생성 API 호출 (HTTP)")
    try:
        if not qna_list:
            raise HTTPException(status_code=400, detail="질문과 답이 없습니다.")
        result = await summary_service.generate_summary(qna_list)
        logger.info("제목 생성 성공 (HTTP)")
        return {"title": result}
    except Exception as e:
        logger.error(f"제목 생성 중 에러 발생 (HTTP): {e}")

        raise HTTPException(  #
            status_code=500,
            detail="제목 생성 중 오류가 발생했습니다."
        )



@app.post(
    "/generate/summary",
    response_model=RetrospectiveResponse,
    summary="개발일지 회고록 생성",
    description="""개발일지의 날짜별 상세 내용(질문 및 답변)을 받아 전체 프로젝트 회고록을 생성합니다.

입력/출력 형식
- 입력: 날짜, 요약, 그리고 질문-답변 형식의 일별 개발 로그 리스트 (JSON)
- 출력: 프로젝트 전체를 회고하는 구체적이고 완성도 높은 회고록 (텍스트)

요청 예시:
[
    {
        "date": "2023-10-29",
        "summary": "NLP 모델 개선: ERD 점검, 데이터셋 분류, 한글화 테스트 및 파인튜닝 계획",
        "daily_log": [
            {"question": "수행 작업", "answer": "ERD 점검과 Jupyter 환경 세팅"},
            {"question": "특이 사항", "answer": "긴 글의 정확도 불분명"}
        ]
    }
]

응답 예시:
{"retrospective": "이번 프로젝트는 NLP 모델 개선과 한국어 모델 탐색을 중심으로..."}
""",
    response_description="생성된 프로젝트 회고록"
)

async def generate_retrospective(request: List[DailyLog]):
# async def generate_retrospective(request: List[dict] = Body(...)):
    logger.info("개발일지 회고록 생성 API 호출 (HTTP)")

    try:
        if not request:
            raise HTTPException(status_code=400, detail="회고록 생성에 필요한 데이터가 없습니다.")
        result = await retrospective_service.generate_retrospective(request)
        logger.info("회고록 생성 성공 (HTTP)")
        return RetrospectiveResponse(retrospective=result)
   #     return {"retrospective": result}

    except Exception as e:
        logger.error(f"회고록 생성 중 오류 발생 (HTTP): {e}")
        raise HTTPException(status_code=500, detail="회고록 생성 중 오류가 발생했습니다.")


@app.post(
    "/generate/experience",
    response_model=ExperienceResponse,
    summary="경험 추출 생성",
    description="""회고 내용과 관련 키워드를 입력받아 개발 경험을 추출합니다.

입력/출력 형식
- 입력: 회고 내용과 관련 키워드 목록
- 출력: 추출된 경험 목록 (최대 4개, 각 경험은 제목, 내용, 매칭된 키워드 포함)

요청 예시:
{
    "retrospective_content": "소셜로그인 기능 개발을 통해 사용자의 편의성과 보안성을 동시에 강화하는 경험을 했습니다...",
    "keywords": [
        {"id": 1, "name": "API"},
        {"id": 2, "name": "보안"},
        {"id": 3, "name": "성능"}
    ]
}

응답 예시:
{
    "experiences": [
        {
            "title": "OAuth2 기반 소셜 로그인 구현",
            "content": "소셜로그인 기능 개발을 통해 사용자의 편의성과 보안성을 동시에 강화하는 경험을 했습니다...",
            "keywords": [
                {"id": 1, "name": "API"},
                {"id": 2, "name": "보안"}
            ]
        }
    ]

}

주의사항:
- 각 경험은 300-700자 내외로 작성됩니다.
- 각 경험에는 반드시 구체적인 수치와 성과가 포함됩니다.
- 키워드는 주어진 목록에서만 선택됩니다.
""")
async def generate_experience(request: ExperienceRequest):
    try:
        logger.info(f"경험 추출 생성 API 호출 - 키워드 수: {len(request.keywords)}")

        # 키워드 목록 검증
        for keyword in request.keywords:
            if not isinstance(keyword.id, int) or not isinstance(keyword.name, str):
                raise ValueError("키워드의 'id'는 정수여야 하며, 'name'은 문자열이어야 합니다.")

        # 키워드 중복 검사
        keyword_ids = [keyword.id for keyword in request.keywords]
        if len(set(keyword_ids)) != len(keyword_ids):
            raise ValueError("키워드 목록에 중복된 ID가 있습니다.")
        result = await experience_service.generate_experience(
            request.retrospective_content,
            request.keywords
        )
        logger.info(f"경험 추출 완료 - 추출된 경험 수: {len(result.experiences)}")
        return result
    except ValueError as e:
        logger.error(f"경험 생성 중 오류 발생: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"경험 생성 중 예상치 못한 오류 발생: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="경험 생성 중 오류가 발생했습니다."
        )


# 서버 실행
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
