FROM public.ecr.aws/lambda/python:3.10

# Salin model dan requirements
COPY best_val_acc_model.h5 ${LAMBDA_TASK_ROOT}/best_val_acc_model.h5
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
