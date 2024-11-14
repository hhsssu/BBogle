from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path

class Settings(BaseSettings):
    # AWS 설정
    AWS_REGION: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    
    # RabbitMQ 설정
    rabbitmq_host: str = Field(..., alias="RABBITMQ_HOST")
    rabbitmq_user: str = Field(..., alias="RABBITMQ_USER")
    rabbitmq_pass: str = Field(..., alias="RABBITMQ_PASS")
    
    # 데이터베이스 설정 (필요 시 추가)
    # DATABASE_URL: str

    model_config = {
        "env_file": str(Path(__file__).parent.parent / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",  # 정의되지 않은 필드 무시
        "populate_by_name": True  # alias 사용 가능
    }

settings = Settings()

# 설정값 출력 (디버깅용)
# print(f"Loaded RabbitMQ Host: {settings.rabbitmq_host}")
