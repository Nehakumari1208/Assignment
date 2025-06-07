import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [readability, setReadability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = "http://localhost:4000";

  const handleAnalyze = async () => {
    setError("");
    if (inputText.trim() === "") {
      setError("Please enter some text.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/analyze`, {
        text: inputText,
      });
      const data = response.data;
      setKeywords(data.keywords || []);
      setReadability(data.readability);
    } catch (err) {
      setError(
        err.response?.data?.error || "Network error while analyzing text."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInsertKeyword = async (keyword) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/insert-keyword`, {
        text: inputText,
        keyword,
      });
      setInputText(response.data.updatedText);
    } catch (err) {
      alert(err.response?.data?.error || "Error inserting keyword.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        SEO Analyzer Web App
      </h1>

      <textarea
        rows={8}
        className="w-full border border-gray-300 p-4 rounded-lg text-base resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Paste your blog, tweet, or text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg text-base font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze SEO"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {readability !== null && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">SEO Analysis Results</h3>
          <p>
            <span className="font-medium">Readability Score:</span>{" "}
            {readability}
          </p>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="mt-6 bg-gray-600 border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Recommended Keywords</h3>
          <ul className="space-y-2">
            {keywords.map((kw, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-black p-2 rounded-md"
              >
                <span>{kw}</span>
                <button
                  onClick={() => handleInsertKeyword(kw)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                >
                  Insert
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Text Preview</h3>
        <div className="whitespace-pre-wrap p-4 border border-gray-300 rounded-md bg-black min-h-[100px]">
          {inputText}
        </div>
      </div>
    </div>
  );
}

export default App;

