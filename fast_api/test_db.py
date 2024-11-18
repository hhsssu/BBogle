from sqlalchemy import create_engine, Column, Integer, String, text
from sqlalchemy.orm import sessionmaker, declarative_base  # 변경된 위치에서 가져오기

DATABASE_URL = "mysql+pymysql://root:tkachdtk1%21@127.0.0.1:3306/"
DATABASE_NAME = "fast_api"

# MySQL 서버에 연결 (데이터베이스 이름 없이)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()  # 여기에서 declarative_base()가 사용됩니다


# 예시 테이블 정의
class ExampleTable(Base):
    __tablename__ = "example_table"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    age = Column(Integer)

def create_database_if_not_exists(engine, database_name):
    # 데이터베이스가 존재하는지 확인하고 없으면 생성
    with engine.connect() as conn:
        result = conn.execute(text(f"SHOW DATABASES LIKE '{database_name}';"))
        exists = result.fetchone() is not None
        if not exists:
            conn.execute(text(f"CREATE DATABASE {database_name}"))
            print(f"Database '{database_name}' created.")
        else:
            print(f"Database '{database_name}' already exists.")

def test_connection():
    try:
        # 연결 URL에 데이터베이스 이름을 추가
        db_engine = create_engine(DATABASE_URL + DATABASE_NAME)
        with db_engine.connect() as connection:
            print("Database connection successful!")
            # 쿼리를 text()로 래핑하여 실행
            result = connection.execute(text("SELECT DATABASE();"))
            db_name = result.scalar()
            print(f"Connected to database: {db_name}")
        return db_engine
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        return None

if __name__ == "__main__":
    # 데이터베이스가 없을 경우 생성
    create_database_if_not_exists(engine, DATABASE_NAME)

    # 데이터베이스에 연결하고 테이블 생성
    db_engine = test_connection()
    if db_engine:
        # 테이블 생성
        Base.metadata.create_all(bind=db_engine)
        print("Tables created successfully!")
