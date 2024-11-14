from pydantic_settings import BaseSettings
from pathlib import Path
from pydantic import Field
from pydantic.config import ConfigDict

class Settings(BaseSettings):
    # AWS 설정
    AWS_REGION: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str

    # RabbitMQ 설정
    rabbitmq_host: str = Field(alias="RABBITMQ_HOST")
    rabbitmq_user: str = Field(alias="RABBITMQ_USER")
    rabbitmq_pass: str = Field(alias="RABBITMQ_PASS")

    # 데이터베이스 설정 (필요 시 주석 해제 및 추가)
    # DATABASE_URL: str

    # Pydantic 설정
    model_config = ConfigDict(
        env_file=Path(__file__).parent.parent / ".env",  # .env 파일 경로 설정
        env_file_encoding="utf-8",
        extra="forbid",  # 정의되지 않은 환경 변수 입력 시 에러 발생
        populate_by_name=True  # alias를 사용하여 환경 변수 매핑 허용
    )

settings = Settings()
