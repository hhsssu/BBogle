from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from . import models

app = FastAPI()

# 테이블 생성
Base.metadata.create_all(bind=engine)

# 데이터베이스 연결 확인용 엔드포인트
@app.get("/check-db")
def check_db_connection(db: Session = Depends(get_db)):
    # 예시 테이블이 제대로 생성되었는지 확인하는 쿼리
    try:
        result = db.execute("SHOW TABLES;").fetchall()
        return {"message": "Database connected successfully!", "tables": result}
    except Exception as e:
        return {"message": "Database connection failed", "error": str(e)}