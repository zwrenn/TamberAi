import React, { useState } from 'react';
import openai from 'openai';

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
    const generatedText = await generateLyrics(selectedParameters);
    setGeneratedLyrics(generatedText);
  }

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
      <div>
        <h2>Generated Lyrics:</h2>
        <p>{generatedLyrics}</p>
      </div>
    </div>
  );
}

export default LyricsGenerator;
