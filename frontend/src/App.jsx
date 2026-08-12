import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const detectEssay = async () => {
    if (!essay.trim()) {
      setError("Please enter an essay first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: essay,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Backend error (${response.status}): ${errorText}`
        );
      }

      const data = await response.json();

      console.log("Backend response:", data);
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        "Unable to connect to the AI detection server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>AI Essay Detector</h1>
        <p>
          Analyze your essay and check whether it shows signs of
          AI-generated writing.
        </p>
      </header>

      <main className="container">
        <div className="input-section">
          <label htmlFor="essay">
            Enter your essay
          </label>

          <textarea
            id="essay"
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Paste your essay here..."
            rows={12}
          />

          <button
            onClick={detectEssay}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Detect AI"}
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className="result">
            <h2>Detection Result</h2>

            <pre>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;