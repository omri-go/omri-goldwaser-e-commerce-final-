FROM python:3.11.2-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /server

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000