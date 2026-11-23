FROM python:3.12-slim

WORKDIR /app

COPY . .

EXPOSE 8000

CMD ["python3", "server.py", "--lan", "--port", "8000", "--db", "/data/aathi.db"]
