# app/schemas/experience_schema.py
from pydantic import BaseModel

class ExperienceRequest(BaseModel):
    retrospective_content: str
    keywords: str

class ExperienceResponse(BaseModel):
    experience: str