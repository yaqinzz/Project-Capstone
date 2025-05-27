import numpy as np
from flask import Flask, request, render_template
#import ml_pneumonia

#Create an app object using the Flask class. 
app = Flask(__name__)

#Load the trained model. (Pickle file)
model = pneumonia.load(open('models/model.pnm', 'rb'))
