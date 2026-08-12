from pydantic import BaseModel
from typing import List

class SentenceHighlight(BaseModel):
    sentence: str
    ai_score: float # 0.0 = human, 1.0 = AI
    reasons: List[str]

class EssayResponse(BaseModel):
    overall_ai_score: float
    highlights: List[SentenceHighlight]
    signals: dict # raw stats for debugging

class EssayRequest(BaseModel):
    text: str