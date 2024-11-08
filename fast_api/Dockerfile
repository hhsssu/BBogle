FROM python:3.12.3-slim

WORKDIR /app #설치 위치 설정

COPY requirements.txt /app/requirements.txt

# RUN apt-get update -y # 업데이트인데 

RUN pip install --upgrade pip
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

CMD ["python3", "fast_api/app/main.py"]