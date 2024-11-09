FROM python:3.12.3-slim

WORKDIR /app
# ENV PYTHONPATH=/app

COPY requirements.txt /app/requirements.txt

# RUN apt-get update -y

RUN pip install --upgrade pip
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# COPY . /app
COPY . .
RUN ls -R /app 

CMD ["python3", "-m", "app/main.py"]
