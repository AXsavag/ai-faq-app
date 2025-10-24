import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./index.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "What services do you offer?",
    "How much does it cost?",
    "How do I get started?",
    "Do you offer support?",
    "Do you work internationally?"
  ];

  async function ask(q) {
    // Use the passed question 'q' or the state 'question'
    const userQuestion = (q || question || "").toString();
    if (!userQuestion.trim()) return;

    setLoading(true);
    setAnswer(""); // Clear previous answer

    try {
      const res = await axios.post(
        "https://ai-faq-app.onrender.com/ask",
        { question: userQuestion },
        { headers: { "Content-Type": "application/json" } }
      );

      setAnswer(res.data.answer || "No answer returned.");
    } catch (err) {
      console.error(err);
      setAnswer("❌ Error fetching response. Please try again.");
    } finally {
      setLoading(false);
      // Only clear the input field if the user did NOT click a suggestion
      if (!q) {
        setQuestion("");
      }
    }
  }

  // Render answer - if lines begin with "-" we show them as clickable fallback buttons
  const renderAnswer = () => {
    if (!answer) return null;

    const lines = answer.split("\n").map(line => line.trim()).filter(Boolean);

    return lines.map((line, i) => {
      if (line.startsWith("- ")) {
        const text = line.replace(/^-+\s*/, "");
        return (
          <button
            key={i}
            onClick={() => ask(text)}
            className="block text-left w-full px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
            style={{ background: "transparent", border: "none", color: "#334155" /* slate-700 */ }}
          >
            {text}
          </button>
        );
      } else {
        // Use ReactMarkdown for nicer formatting
        return (
          <div key={i} className="prose prose-sm text-slate-800 mb-2 max-w-none">
            <ReactMarkdown>{line}</ReactMarkdown>
          </div>
        );
      }
    });
  };

  return (
    // Increased vertical padding (py-12 or py-20) for more space
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-10 py-12 sm:py-20">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          {/* Removed emoji, increased text size and used softer colors */}
          <h1 className="text-4xl font-bold text-slate-800">
            Business FAQ Assistant
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Ask a question or pick one of the suggestions below.
          </p>
        </header>

        {/* Increased gap between buttons */}
        <section className="flex flex-wrap gap-3 mb-8 justify-center">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => ask(s)}
              className="suggestion-btn" // This class is now styled in index.css
            >
              {s}
            </button>
          ))}
        </section>

        {/* Main card: Softer shadow, more padding, slightly more rounded */}
        <main className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(question);
            }}
            className="flex flex-col sm:flex-row gap-3 mb-4"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              // Updated input styling: softer border and focus ring
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              // Updated button: Changed to a professional 'indigo' color, larger, and matches input style
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm disabled:opacity-50 transition-colors"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </form>

          {/* Answer area */}
          <div className="mt-6">
            {answer ? (
              // Updated answer box: Softer colors
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                {renderAnswer()}
              </div>
            ) : (
              // Updated placeholder text color
              <div className="text-slate-500 text-center py-4">
                Answers will appear here.
              </div>
            )}
          </div>
        </main>

        <footer className="mt-8 text-center">
          {/* Footer link: Made it subtle and clean, removed button look */}
          <a
            href="mailto:muktaribro13@gmail.com"
            className="font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            Contact Us
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
