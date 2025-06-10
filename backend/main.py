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
model = tf.keras.models.load_model('best_val_acc_model.h5')

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
    img = image.load_img(io.BytesIO(contents), target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    
    # Make prediction
    prediction = model.predict(img_array)  # Output shape: (1, 2)
    predicted_class = np.argmax(prediction[0])  # Get index of class with highest probability
    confidence = prediction[0][predicted_class]
    
    # Class labels (must match order used during training)
    # Based on the output of flow_from_dataframe during training
    class_labels = ['NORMAL', 'PNEUMONIA']
    predicted_label = class_labels[predicted_class]
    
    # Convert confidence to percentage for the response
    probability_percent = float(confidence * 100)
    
    # Return result
    return PredictionResponse(
        label=predicted_label,
        probability=probability_percent
    )

# if __name__ == '__main__':
#     uvicorn.run(app, host="0.0.0.0", port=9000, timeout_keep_alive=1200)
