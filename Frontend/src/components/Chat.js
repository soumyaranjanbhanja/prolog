import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import "./Chat.css";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Handle any initial setup or updates
  }, []);

  const handleToggleChatbox = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = e.target.elements.message.value.trim();

    if (userMessage !== '') {
      const timestamp = new Date().toLocaleTimeString();
      setMessages((prevMessages) => [...prevMessages, { text: userMessage, type: 'user', time: timestamp }]);

      // Process user message and generate bot response
      const botResponse = generateBotResponse(userMessage);
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, type: 'bot', time: timestamp }]);

      // Send user message via email
      sendEmail(userMessage);
    }

    e.target.reset(); // Reset the form
  };

  const generateBotResponse = (userMessage) => {
    // Add your conditional logic here to generate a response based on the user's query
    // For demonstration, a simple example is provided
    if (userMessage.toLowerCase().includes('hello')) {
      return 'Hi there! How can I help you?';
    } else if (userMessage.toLowerCase().includes('goodbye')) {
      return 'Goodbye! Have a great day!';
    } else {
      return 'I m sorry, I did not understand that. Can you please provide more details?';
    }
  };

  const sendEmail = (userMessage) => {
    // Replace with your actual emailjs configuration
    const serviceId = 'gmail';
    const templateId = 'youtube_template';
    const userId = 'VvKrVIkefU90f3Sa-';

    const templateParams = {
      message: userMessage,
    };

    emailjs
      .send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <div className={`chatbox-container ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
 {isOpen ? (
        <div className="chatbox-content">
          <div className="chatbox-header">
            <div className="user-info">
              <img
                src="https://placekitten.com/50/50"
                alt="User Avatar"
                className="user-avatar"
              />
              <p className="user-name">User Name</p>
            </div>
            <button className="close-button" onClick={handleToggleChatbox}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="chatbox-thread">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">{message.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chatbox-input">
            <div className="form-group">
              <textarea name="message" rows="1" placeholder="Type a message..." required />
            </div>
            <button type="submit" className="send-button">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      ) : (
        <div className="chatboxt" onClick={handleToggleChatbox}>
          <button className="open-button">
            <i className="fa-solid fa-comment"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;

