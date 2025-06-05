FROM python:3.10.10

WORKDIR /app

# Upgrade pip dan tools dasar
RUN pip install --upgrade pip setuptools wheel

# Salin requirements terlebih dahulu agar bisa cache layer pip install
COPY requirements.txt .

# Install semua package termasuk TensorFlow 2.18.0
RUN pip install --no-cache-dir --retries 10 --timeout 600 --progress-bar off \
    --compile --prefer-binary -r requirements.txt

# Salin seluruh source code Anda
COPY . .

# Buka port 8080
EXPOSE 8080

ENV PYTHONUNBUFFERED=1

# Jalankan FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
