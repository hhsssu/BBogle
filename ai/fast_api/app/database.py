from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings  # 환경변수나 설정값을 담고 있는 파일 (settings.DATABASE_URL을 불러온다고 가정)

# SQLAlchemy 엔진 및 세션 설정
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency 함수로 DB 세션 제공
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
