import { useEffect } from 'react';

const UseVoiceCommand = (command, action) => {
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i][0].transcript.trim().toLowerCase() === command.toLowerCase()) {
          action();
        }
      }
    };

    recognition.start();
    return () => {
      recognition.stop();
    };
  }, [command, action]);
};

export default UseVoiceCommand;
