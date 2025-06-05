import uvicorn
from enum import Enum
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Path, Query, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import io

app = FastAPI()  # create a new FastAPI app instance

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

port = int(os.getenv("PORT", "8080"))  # Default to 8080 if PORT env var is not set

# Load the pneumonia detection model
model = tf.keras.models.load_model('./model/model_pneumonia.keras')

# Define response model
class PredictionResponse(BaseModel):
    label: str
    probability: float

@app.get("/")
def hello_world():
    return {"message": "Pneumonia Detection API"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_pneumonia(file: UploadFile = File(...)):
    # Read the image file
    contents = await file.read()
    
    # Convert to image
    img = image.load_img(io.BytesIO(contents), target_size=(128, 128))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    
    # Make prediction
    prediction = model.predict(img_array)[0][0]
    label = "PNEUMONIA" if prediction > 0.5 else "NORMAL"
    probability = float(prediction if prediction > 0.5 else 1 - prediction)
    
    # Return result
    return PredictionResponse(
        label=label,
        probability=probability
    )

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=port, timeout_keep_alive=1200)
