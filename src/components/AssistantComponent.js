import axios from "axios";
import React, { useState, useEffect } from "react";
import "./AssistantComponent.css";
import { addVoiceCommand } from "./VoiceCommandManager";

const OPENAI_API_KEY = "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";

const processQueryWithGPT4 = async (query) => {
  try {
    const structuredPrompt = `Given the request '${query}', what are a few one word key musical descriptors?`;
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: structuredPrompt,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].text.trim().split("\n");
  } catch (error) {
    console.error("Error processing query with GPT-4:", error);
    return null;
  }
};

const searchDatabase = async (inferredMood) => {
  try {
    // Extract individual moods from the received string
    const processedMoods = inferredMood[0]
      .split(",")
      .map((mood) => mood.trim().replace("'", ""));

    const response = await axios.post("http://localhost:5001/api/search-mood", {
      moodsFromGPT: processedMoods,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching the database:", error);
    return [];
  }
};

const AssistantComponent = () => {
  const [showChat, setShowChat] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  // eslint-disable-next-line
  const [error, setError] = useState(null);

  useEffect(() => {
    addVoiceCommand("hide assistant", () => setShowChat(false));
    addVoiceCommand("show assistant", () => setShowChat(true));
  }, []);

  const handleSearch = async () => {
    try {
      console.log("Sending query to GPT-4:", query);
      const inferredMood = await processQueryWithGPT4(query);
      console.log("Received inferred mood from GPT-4:", inferredMood);

      const splitMoods = inferredMood[0].split(",").map((mood) => mood.trim());
      console.log("Processed moods for database search:", splitMoods);

      console.log("Sending inferred mood to backend:", splitMoods);
      const matchingSongs = await searchDatabase(splitMoods);
      console.log("Received song matches from backend:", matchingSongs);

      setResults(matchingSongs);
    } catch (err) {
      console.error("Error in handleSearch:", err);
      setError("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <div className="assistant-container">
      <button className="toggle-button" onClick={() => setShowChat(!showChat)}>
        {showChat ? "Hide Assistant" : "Show Assistant"}
      </button>
      {showChat && (
        <div className="chat-bubble">
          <p>Hello, how can I assist you today?</p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs..."
          />
          <button onClick={handleSearch}>Search</button>

          <div className="results">
            {results.length > 0 && (
              <div>
                <p>Here are some song recommendations based on your search:</p>
                <ul>
                  {results.map((song) => (
                    <li key={song.id}>
                      {song.title} by {song.artist}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantComponent;
