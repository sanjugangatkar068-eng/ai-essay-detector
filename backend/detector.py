import re

def predict(text: str):
    """
    Rule-based AI Detector - Perfect for hackathon demo
    Checks for AI patterns vs Human patterns
    """
    if len(text.strip()) < 100:
        return {
            "prediction": "Text Too Short",
            "ai_probability": 0,
            "human_probability": 0,
            "message": "Please enter at least 100 characters / 4 sentences"
        }
    
    ai_score = 0
    human_score = 0
    text_lower = text.lower()
    
    # === AI PATTERNS === +10 points each
    ai_words = [
        "delve", "landscape", "tapestry", "realm", "crucial", "furthermore", 
        "moreover", "additionally", "in conclusion", "it is important to note",
        "significantly", "underscores", "comprehensive", "facilitate", "leverage",
        "paradigm", "nuanced", "robust", "intricate"
    ]
    for word in ai_words:
        ai_score += text_lower.count(word) * 10
    
    # AI has very similar sentence lengths = low variance
    sentences = [s for s in re.split(r'[.!?]+', text) if s.strip()]
    if len(sentences) > 2:
        sentence_lengths = [len(s.split()) for s in sentences]
        avg_len = sum(sentence_lengths) / len(sentence_lengths)
        variance = sum((x - avg_len) ** 2 for x in sentence_lengths) / len(sentence_lengths)
        if variance < 15: # AI writes uniform sentences
            ai_score += 30
    
    # AI overuses "The" at start of sentences
    the_starts = len(re.findall(r'\. The |\AThe ', text))
    ai_score += the_starts * 5
    
    # AI rarely uses "I"
    if text_lower.count(" i ") < 2:
        ai_score += 10
    
    # === HUMAN PATTERNS === +10 points each
    contractions = ["don't", "can't", "it's", "i'm", "you're", "we're", "didn't", "i'll", "i've", "they're"]
    for c in contractions:
        human_score += text_lower.count(c) * 10
    
    # Human uses slang, emotion
    human_words = ["omg", "lol", "btw", "tbh", "wanna", "gonna", "kinda", "bro", "like", "idk", "imo"]
    for word in human_words:
        human_score += text_lower.count(word) * 15
    
    # Human uses "I" and "me"
    human_score += text_lower.count(" i ") * 5
    human_score += text_lower.count(" me ") * 5
    
    # Human has varied sentence length = high variance
    if len(sentences) > 2:
        if variance > 30:
            human_score += 20
    
    # === FINAL DECISION ===
    total = ai_score + human_score
    if total == 0: # default to 50/50 if no patterns found
        ai_prob = 50
        human_prob = 50
    else:
        ai_prob = (ai_score / total) * 100
        human_prob = (human_score / total) * 100
    
    # Prediction = whichever is higher
    if ai_prob >= human_prob:
        prediction = "AI-Generated"
    else:
        prediction = "Human-Written"
    
    return {
        "prediction": prediction,
        "ai_probability": round(ai_prob, 2),
        "human_probability": round(human_prob, 2)
    }