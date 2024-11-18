# schemas/experience_schema.py
from pydantic import BaseModel, Field
from typing import List

class Keyword(BaseModel):
    id: int
    name: str

class ExperienceRequest(BaseModel):
    retrospective_content: str = Field(
        ...,
        description="회고 내용"
    )
    keywords: List[Keyword] = Field(
        ...,
        description="선택 가능한 키워드 목록"
    )

class ExtractedExperience(BaseModel):
    title: str = Field(
        ...,
        description="추출된 경험의 요약 제목 (20자 이내)"
    )
    content: str = Field(
        ...,
        description="추출된 경험 내용"
    )
    keywords: List[Keyword] = Field(
        ...,
        description="해당 경험에 매칭된 키워드들"
    )

class ExperienceResponse(BaseModel):
    experiences: List[ExtractedExperience]
