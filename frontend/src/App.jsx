import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const detectEssay = async () => {
    // Validate essay
    if (!essay.trim()) {
      setError("Please enter an essay first.");
      return;
    }

    // Check API configuration
    if (!API_URL) {
      setError("Backend API URL is not configured.");
      console.error("VITE_API_URL is missing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("API URL:", API_URL);
      console.log("Sending request to:", `${API_URL}/predict`);

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
          `Server error ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      console.log("Backend response:", data);

      setResult(data);
    } catch (error) {
      console.error("Detection error:", error);

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
          Analyze your essay and check whether it shows signs
          of AI-generated writing.
        </p>
      </header>


      <main className="container">

        <section className="input-section">

          <label htmlFor="essay">
            Enter your essay
          </label>

          <textarea
            id="essay"
            value={essay}
            onChange={(event) => {
              setEssay(event.target.value);
              setError("");
            }}
            placeholder="Paste your essay here..."
            rows={12}
          />


          <button
            onClick={detectEssay}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Detect AI"}
          </button>

        </section>


        {error && (
          <div className="error">
            {error}
          </div>
        )}


        {result && (
          <section className="result">

            <h2>
              Detection Result
            </h2>

            <pre>
              {JSON.stringify(result, null, 2)}
            </pre>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;