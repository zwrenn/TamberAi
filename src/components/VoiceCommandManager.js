import { useEffect } from 'react';

let commands = {};

export const addVoiceCommand = (command, action) => {
    commands[command] = action;
  };
  
  export const useGlobalVoiceCommands = () => {
    useEffect(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
  
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim().toLowerCase();
          
          // Check for matching commands
          for (const command in commands) {
            if (transcript.startsWith(command)) {
              const voiceParams = transcript.substring(command.length).trim();
              commands[command](voiceParams);
            }
          }
        }
      };
  
      recognition.start();
      return () => {
        recognition.stop();
      };
    }, []);
  };