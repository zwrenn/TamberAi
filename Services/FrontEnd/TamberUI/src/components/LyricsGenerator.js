import React, { useState, useEffect } from "react";
import openai from "openai";
import "./LyricsGenerator.css";

// Your OpenAI API key
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
openai.apiKey = OPENAI_API_KEY;

function LyricsGenerator() {
  const [generatedLyrics, setGeneratedLyrics] = useState("");
  const [highlightedLyrics, setHighlightedLyrics] = useState([]); // New state, array of highlighted indices
  const [selectedParameters, setSelectedParameters] = useState({
    era: "",
    genre: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  async function generateLyrics(parameters) {
    const prompt = `Generate lyrics in the style of a ${parameters.era} ${parameters.genre} song with the following parameters:
    ... (construct the prompt with all parameters) ...`;

    const response = await openai.Completion.create({
      engine: "text-davinci-003", // GPT-3.5 engine
      prompt: prompt,
      max_tokens: 100, // Adjust as needed
    });

    return response.choices[0].text;
  }

  async function handleGenerateLyrics() {
    setLoading(true);
    setLoadingPercentage(0);

    const generatedText = await generateLyrics(selectedParameters);
    setLoading(false);
    setLoadingPercentage(100);

    setGeneratedLyrics(generatedText);
    setHighlightedLyrics([]); // Reset the highlighted lyrics
  }

  useEffect(() => {
    // Simulate percentage increase while loading
    if (loading && loadingPercentage < 90) {
      const interval = setInterval(() => {
        setLoadingPercentage((prev) => Math.min(prev + 10, 90));
      }, 500); // Increase every 0.5 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount or completion
    }
  }, [loading, loadingPercentage]);

  // Rendering logic to include highlights
  const renderLyrics = () => {
    return generatedLyrics.split(" ").map((word, index) => {
      if (highlightedLyrics.includes(index)) {
        return <span className="highlighted">{word} </span>;
      }
      return `${word} `;
    });
  };

  return (
    <div>
      {/* Your JSX for the input fields */}
      {/* Example: */}
      <input
        type="text"
        value={selectedParameters.era}
        onChange={(e) =>
          setSelectedParameters({ ...selectedParameters, era: e.target.value })
        }
      />
      <input
        type="text"
        value={selectedParameters.genre}
        onChange={(e) =>
          setSelectedParameters({
            ...selectedParameters,
            genre: e.target.value,
          })
        }
      />
      <button onClick={handleGenerateLyrics}>Generate Lyrics</button>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>{loadingPercentage}%</p>
        </div>
      )}
      <div>
        <h2>Generated Lyrics:</h2>
        <p>{renderLyrics()}</p> {/* Render lyrics with highlights */}
      </div>
    </div>
  );
}

export default LyricsGenerator;
