FROM public.ecr.aws/lambda/python:3.10

# Salin model dan requirements
COPY model_pneumonia.keras ${LAMBDA_TASK_ROOT}/model_pneumonia.keras
COPY requirements.txt .

# Install dependencies dari requirements.txt
RUN pip3 install -r requirements.txt \
    --target "${LAMBDA_TASK_ROOT}" \
    --no-cache-dir --retries 10 --timeout 600 --progress-bar off --compile --prefer-binary

# 🔧 Install TensorFlow secara terpisah
RUN pip3 install tensorflow-cpu==2.18.0 \
    --target "${LAMBDA_TASK_ROOT}" \
    --no-cache-dir --retries 10 --timeout 600 --progress-bar off --compile --prefer-binary

# Salin source code Python ke direktori Lambda
COPY main.py ${LAMBDA_TASK_ROOT}

# Handler Lambda
CMD ["main.handler"]
