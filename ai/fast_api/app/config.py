from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # AWS 설정
    AWS_REGION: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    
    # 데이터베이스 설정
    DATABASE_URL: str

    class Config:
        # .env 파일의 절대 경로 설정
        env_file = Path(__file__).parent.parent / ".env"

settings = Settings()

# 설정값 출력
print(f"Loaded DATABASE_URL: {settings.DATABASE_URL}")
