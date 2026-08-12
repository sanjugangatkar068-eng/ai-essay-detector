from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import detector  # your model file

app = FastAPI(title="AI Essay Detector API")

# CORS so frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EssayRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "AI Essay Detector API is running"}

@app.post("/predict")
def predict_essay(req: EssayRequest):
    result = detector.predict(req.text)  # <-- only calling predict
    return result