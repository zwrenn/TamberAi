import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./theme/ChatWidget.css";

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); // Reference to the end of the messages

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Auto-scroll when messages change

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add user message to the conversation
    setMessages([...messages, { text: input, sender: "user" }]);

    // Send user query to server
    try {
      const response = await axios.post("/get-gpt3-response", {
        query: input,
      });

      // Split the response into individual messages
      const responseMessages = response.data.response
        .split("\n")
        .filter((line) => line.trim() !== "");

      // Add GPT-3 response messages to the conversation
      const newMessages = [
        ...messages,
        ...responseMessages.map((text) => ({ text, sender: "bot" })),
      ];
      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div> {/* Dummy div at the end */}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWidget;
