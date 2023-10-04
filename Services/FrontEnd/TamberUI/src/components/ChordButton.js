import React from "react";

function ChordButton({ chordName, onClick }) {
  return <button onClick={onClick}>{chordName}</button>;
}

export default ChordButton;
