import { useState } from 'react';
import './App.css';

const SAMPLE_AI = "Artificial intelligence is fundamentally transforming the landscape of modern education through personalized learning experiences and automated assessment systems. These technological advancements enable educators to provide tailored instruction that adapts to individual student needs.";

const SAMPLE_HUMAN = "I had the craziest day today. I woke up late and missed my bus, so I had to run to college. My friend saved me a seat in class and we laughed about it later. Honestly, days like this make life feel real.";

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Error: Is your backend running on port 8000?');
    }
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(`Prediction: ${result.prediction}\nAI: ${result.ai_probability}%\nHuman: ${result.human_probability}%`);
    alert('Copied to clipboard!');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>✨ AI Essay Detector Pro</h1>
        <p className="subtitle">Detect AI-generated content instantly</p>
      </div>
      
      <div className="textarea-wrapper">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your essay here to analyze..."
        />
        <span className="word-count">Words: {wordCount}</span>
      </div>
      
      <div className="button-group">
        <button className="btn btn-secondary" onClick={() => setText(SAMPLE_AI)}>Example: AI</button>
        <button className="btn btn-secondary" onClick={() => setText(SAMPLE_HUMAN)}>Example: Human</button>
        <button className="btn btn-secondary" onClick={() => {setText(''); setResult(null)}}>Clear</button>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{marginTop: '12px', width: '100%'}}>
        {loading ? 'Analyzing...' : 'Detect AI'}
      </button>

      {result && (
        <div className="result-box">
          <h3>Analysis Result</h3>
          <p style={{fontSize: '1.3rem', fontWeight: 700, color: '#4c51bf'}}>Prediction: {result.prediction}</p>
          
          <p><b>AI Probability:</b> {result.ai_probability}%</p>
          <div className="confidence-bar"><div className="confidence-fill" style={{width: `${result.ai_probability}%`}}></div></div>
          
          <p><b>Human Probability:</b> {result.human_probability}%</p>
          <div className="confidence-bar"><div className="confidence-fill" style={{width: `${result.human_probability}%`}}></div></div>

          <button className="btn btn-secondary" onClick={copyResult} style={{marginTop: '15px'}}>Copy Result</button>
        </div>
      )}
    </div>
  );
}

export default App;