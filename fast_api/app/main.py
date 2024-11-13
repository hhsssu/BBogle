from typing import List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from .services.devlog_summary_service import DevLogSummaryService
from .services.retrospective_service import RetrospectiveService
from .services.experience_service import ExperienceService
from .config import settings
import logging


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
    docs_url="/ai/docs",
    redoc_url=None
    # root_path="/ai"  # 모든 경로에 /ai 접두사 추가
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
   # allow_origins=["http://k11b102.p.ssafy.io"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 초기화
summary_service = DevLogSummaryService(settings)
retrospective_service = RetrospectiveService(settings)
experience_service = ExperienceService(settings)

@app.post(
    "/ai/generate/title", 
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
    logger.info("개발일지 제목 생성 API 호출")
    try:
        if not qna_list:
            raise HTTPException(status_code=400, detail="질문과 답이 없습니다.")
        result = await summary_service.generate_summary(qna_list)
        logger.info("제목 생성 성공")
        return {"title": result}
    except Exception as e:
        logger.error(f"제목 생성 중 에러 발생: {e}")
        raise


@app.post(
    "/ai/generate/summary",
    response_model=dict,
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
async def generate_retrospective(request: List[dict] = Body(...)):
    logger.info("개발일지 회고록 생성 API 호출")
    try:
        result = await retrospective_service.generate_retrospective(request)
        return {"retrospective": result}
    except Exception as e:
        logger.error(f"회고록 생성 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="회고록 생성 실패")


@app.post(
    "/ai/generate/experience",
    response_model=dict,
    summary="경험 추출 생성",
    description="""회고 내용과 키워드를 기반으로 구체적이고 경험에 맞는 자기소개서 형식의 내용을 생성합니다.

입력/출력 형식
- 입력: 회고 내용 (텍스트) 및 키워드 리스트 (콤마로 구분된 문자열)
- 출력: 회고 내용을 바탕으로 키워드에 맞춘 경험 서술 (텍스트)

요청 예시:
{
    "retrospective_content": "이번 프로젝트에서 다양한 성과를 거두었습니다. 특히 NLP 모델을 최적화하여...",
    "keywords": "사용자 경험 개선, 코드 품질 향상, 최적화, 자동화"
}

응답 예시:
{
    "experience": "저는 NLP 모델의 성능 최적화를 담당했습니다. 이 과정에서 35% 성능 향상과..."
}

주의사항:
- 각 경험은 독립적이며 구체적 수치를 포함해야 합니다.
- 동일 키워드 내 내용 중복 및 추상적 서술을 피해주세요.
""",
    response_description="생성된 자기소개서 형식의 경험"
)
async def generate_experience(
    retrospective_content: str = Body(..., example="회고 내용을 입력하세요"),
    keywords: str = Body(..., example="사용자 경험 개선, 코드 품질 향상, 최적화")
):
    logger.info("경험 추출 생성 API 호출")
    try:
        result = await experience_service.generate_experience(retrospective_content, keywords)
        return result
    except Exception as e:
        logger.error(f"경험 생성 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="경험 생성 실패")
# 서버 실행
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
