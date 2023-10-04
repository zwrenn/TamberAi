import React, { useState } from "react";
import ChordButton from "./ChordButton";
import { Howl } from "howler";

function ChordPlayer() {
  const [chordInput, setChordInput] = useState("");

  // Define your chord-to-frequencies map
  const chordFrequenciesMap = {
    "a major": [440, 554.37, 659.26],
    "d minor": [293.66, 366.67, 440],
    "g major": [392, 493.88, 587.33],
    // Add more chords and frequencies as needed
  };

  function getChordFrequencies(chordName) {
    const lowercaseChordName = chordName.toLowerCase();
    return chordFrequenciesMap[lowercaseChordName] || [];
  }

  function playChord(chordFrequencies) {
    const sound = new Howl({
      src: ["/path/to/chord-sound.mp3"], // Replace with actual sample path
      volume: 0.5,
      onload: () => {
        sound.play();
      },
    });
  }

  function handlePlayButtonClick() {
    const chordFrequencies = getChordFrequencies(chordInput);

    if (chordFrequencies.length > 0) {
      playChord(chordFrequencies);
    }
  }

  const predefinedChords = ["A Major", "D Minor", "G Major"];

  return (
    <div>
      <h1>Chord Player</h1>
      <div className="chord-input">
        <label htmlFor="chordInput">Enter chord:</label>
        <input
          type="text"
          id="chordInput"
          value={chordInput}
          onChange={(e) => setChordInput(e.target.value)}
        />
        <button onClick={handlePlayButtonClick}>Play Chord</button>
      </div>
      <div className="chord-buttons">
        {predefinedChords.map((chordName) => (
          <ChordButton
            key={chordName}
            chordName={chordName}
            onClick={() => {
              const chordFrequencies = getChordFrequencies(chordName);
              playChord(chordFrequencies);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ChordPlayer;
