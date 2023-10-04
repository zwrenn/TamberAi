import React from "react";
import axios from "axios";

function AppleScriptButton() {
  const runAppleScript = async () => {
    try {
      const response = await axios.get("http://localhost:5001/run-script");
      console.log(response.data);
    } catch (error) {
      console.error("Error running script:", error);
    }
  };

  return (
    <div className="App">
      <button onClick={runAppleScript}>Run AppleScript</button>
    </div>
  );
}

export default AppleScriptButton;
