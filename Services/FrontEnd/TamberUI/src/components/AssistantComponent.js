import axios from "axios";
import React, { useState, useEffect } from "react";
import "../components/theme/AssistantComponent.css";
import { addVoiceCommand } from "./VoiceCommandManager";
import { Button } from "react-bootstrap";
import openai from "openai";

// Your OpenAI API key
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
openai.apiKey = OPENAI_API_KEY;

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

const searchDatabase = async (processedMoods) => {
  try {
    const response = await axios.post("http://localhost:15002/api/search-mood", {
      moodsFromGPT: processedMoods,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching the database:", error);
    return [];
  }
};

const AssistantComponent = ({ setSelectedTrackUri }) => {
  const [showChat, setShowChat] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    addVoiceCommand("hide assistant", () => setShowChat(false));
    addVoiceCommand("show assistant", () => setShowChat(true));
  }, []);

  const handleSongClick = (spotifyLink) => {
    if (typeof setSelectedTrackUri === "function") {
      setSelectedTrackUri(spotifyLink);
    } else {
      console.error("setSelectedTrackUri is not a function");
    }
  };

  const handleSearch = async () => {
    try {
      const inferredMood = await processQueryWithGPT4(query);
      if (inferredMood) {
        const splitMoods = inferredMood[0]
          .split(",")
          .map((mood) => mood.trim());
        const matchingSongs = await searchDatabase(splitMoods);
        setResults(matchingSongs);
      } else {
        throw new Error("Failed to process query with GPT-4");
      }
    } catch (err) {
      console.error("Error in handleSearch:", err);
      setError("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <div className="assistant-container">
      <Button className="toggle-button" onClick={() => setShowChat(!showChat)}>
        {showChat ? "Hide Assistant" : "Show Assistant"}
      </Button>
      {showChat && (
        <div className="chat-bubble">
          <p>Hello, how can I assist you today?</p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs..."
          />
          <Button onClick={handleSearch} className="mt-4">
            Search
          </Button>
          <div className="results">
            {results.length > 0 && (
              <div>
                <p>Here are some song recommendations based on your search:</p>
                <ul>
                  {results.map((song) => (
                    <li
                      key={song.id}
                      onClick={() => handleSongClick(song["Spotify Link"])}
                    >
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
