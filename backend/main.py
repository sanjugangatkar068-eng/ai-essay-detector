from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import detector

app = FastAPI(title="AI Essay Detector API")


# CORS configuration
# Allows your Vercel frontend and local development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-essay-detector.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EssayRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "message": "AI Essay Detector API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict_essay(req: EssayRequest):
    if not req.text.strip():
        return {
            "error": "Essay text cannot be empty"
        }

    result = detector.predict(req.text)

    return result