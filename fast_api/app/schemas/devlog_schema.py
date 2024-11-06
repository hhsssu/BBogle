# app/schemas/devlog_schema.py
from pydantic import BaseModel
from typing import List

# 질문과 대답 형식
class QnAPair(BaseModel):
    question: str
    answer: str

# 질문 및 대답 입력
class DevLogRequest(BaseModel):
    qna_list: List[QnAPair]

# 답변 반환
class DevLogResponse(BaseModel):
    title: str