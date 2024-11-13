# app/schemas/retrospective_schema.py
from pydantic import BaseModel
from typing import List, Dict

class QnAPair(BaseModel):
    question: str
    answer: str

class DailyLog(BaseModel):
    date: str
    daily_log: List[QnAPair]  # daily_log는 QnAPair의 리스트로 설정
    summary: str