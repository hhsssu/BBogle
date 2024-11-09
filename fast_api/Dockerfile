FROM python:3.12.3-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt

# RUN apt-get update -y

RUN pip install --upgrade pip
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# COPY . /app
COPY . .

CMD ["python3", "fast_api/app/main.py"]
