from typing import List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from .services.devlog_summary_service import DevLogSummaryService
from .config import settings
import logging

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="개발일지 요약 서비스 API | ANSMOON 1.0.1",
    description="개발일지의 질문-답변들을 분석하여 적절한 제목을 생성하는 서비스입니다.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 서비스 초기화
summary_service = DevLogSummaryService(settings)

@app.post("/api/summarize", 
    response_model=dict,
    summary="개발일지 제목 생성",
    description="""개발일지의 질문-답변 리스트를 받아 적절한 제목을 생성합니다.

입력/출력 형식
- 입력: 질문과 답변의 리스트 (JSON)
- 출력: 50자 이내의 요약된 제목

---
요청 예시:
[
    {
        "question": "오늘 수행한 작업은 무엇인가요?",
        "answer": "사이드바 상태관리 수정과 공통 컴포넌트 구현"
    },
    {
        "question": "어려웠던 점은 무엇인가요?",
        "answer": "모달 컴포넌트 설계 시 고려사항이 많았음"
    }
]

---
응답 예시:
{
    "title": "사이드바 상태관리 및 모달 컴포넌트 구현"
}

---
주의사항
- 모든 질문에 답변이 필요합니다
- 빈 리스트는 허용되지 않습니다""",
    response_description="생성된 개발일지 제목"
)
async def summarize_devlog(
    qna_list: List[dict] = Body(  # 바로 리스트를 받도록 수정
        example=[
            {
                "question": "1. 오늘의 목표는 무엇이었나요? 진행 상황을 공유해주세요.",
                "answer": "1. Git 충돌 해결\n2. 코드 리팩토리 및 구조 최적화"
            },
            {
                "question": "2. 진행하면서 어려운 점이 있었나요? 어떻게 해결했나요?",
                "answer": "1. 깃 해결에 많은 시간을 쏟음\n2. 모델 반응 시간이 살짝 느림"
            }
        ]
    )
):
    logger.info("개발일지 제목 생성 API 호출을 명 받았습니다!")
    try:
        if not qna_list:
            raise HTTPException(
                status_code=400,
                detail="질문과 답이 없습니다."
            )

        result = await summary_service.generate_summary(qna_list)
        logger.info("제목 생성 성공!!!")
        
        return {"title": result}
        
    except Exception as e:
        logger.error(f"제목 생성중 에러 ㅠ : {e}")
        raise