import React, { useState, useEffect } from 'react';
import openai from 'openai';
import './LyricsGenerator.css';

// Your OpenAI API key
const apiKey = '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';
openai.apiKey = apiKey;

function LyricsGenerator() {
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [selectedParameters, setSelectedParameters] = useState({
    // Initialize your selected parameters here
    era: '',
    genre: '',
    // ... other parameters
  });
  const [loading, setLoading] = useState(false);  // New state
  const [loadingPercentage, setLoadingPercentage] = useState(0);  // New state

  async function generateLyrics(parameters) {
    const prompt = `Generate lyrics in the style of a ${parameters.era} ${parameters.genre} song with the following parameters:
    ... (construct the prompt with all parameters) ...`;

    const response = await openai.Completion.create({
      engine: 'text-davinci-003', // GPT-3.5 engine
      prompt: prompt,
      max_tokens: 100, // Adjust as needed
    });

    return response.choices[0].text;
  }

  async function handleGenerateLyrics() {
    setLoading(true);
    setLoadingPercentage(0);  // Reset percentage

    const generatedText = await generateLyrics(selectedParameters);
    setLoading(false);  // Hide loader after completion
    setLoadingPercentage(100);  // Set to 100% on completion

    setGeneratedLyrics(generatedText);
  }

  useEffect(() => {
    // Simulate percentage increase while loading
    if (loading && loadingPercentage < 90) {
      const interval = setInterval(() => {
        setLoadingPercentage((prev) => Math.min(prev + 10, 90));
      }, 500);  // Increase every 0.5 seconds

      return () => clearInterval(interval);  // Cleanup interval on unmount or completion
    }
  }, [loading, loadingPercentage]);


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
          setSelectedParameters({ ...selectedParameters, genre: e.target.value })
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
      <p>{generatedLyrics}</p>
    </div>
  </div>
);
}

export default LyricsGenerator;
