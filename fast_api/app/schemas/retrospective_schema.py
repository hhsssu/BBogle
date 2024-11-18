# schemas/retrospective_schema.py
from pydantic import BaseModel
from typing import List

class QnAPair(BaseModel):
    question: str
    answer: str

class DailyLog(BaseModel):
    date: str
    daily_log: List[QnAPair]
    summary: str

class RetrospectiveRequest(BaseModel):
    logs: List[DailyLog]

class RetrospectiveResponse(BaseModel):
    retrospective: str