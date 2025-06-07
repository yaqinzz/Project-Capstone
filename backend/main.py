from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from mangum import Mangum

app = FastAPI()  # create a new FastAPI app instance
handler = Mangum(app)  # create a Mangum handler for AWS Lambda


# Load the pneumonia detection model
model = tf.keras.models.load_model('model_pneumonia.keras')

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

# if __name__ == '__main__':
#     uvicorn.run(app, host="0.0.0.0", port=9000, timeout_keep_alive=1200)
