import React, { useState } from 'react';
import axios from "axios";
import './Chatbot.css';
import emailjs from 'emailjs-com';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users,setUsers]=useState([]);
  

  const handleToggleChatbox = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

 

  const generateBotResponse = (userMessage) => {
    if (userMessage.toLowerCase().includes('hello')) {
      return 'Hello there! How can I help you?';
    } else if (userMessage.toLowerCase().includes('bye')) {
      return 'Goodbye! Have a great day!';
    } else if (userMessage.toLowerCase().includes('fix errors')) {
      return 'ok we very sorry for inconvenience please wait';
    } else if (userMessage.toLowerCase().includes('can you help me')) {
      return 'ok we will get back to you with a solution for this';
    }else if(userMessage.toLowerCase().includes('how are you')){
      return "i am fine,what about you"  
    } else {
      return `You Replied: ${userMessage}`;
    }
  };
  

  const handleSendMessage =async (e) => {
    e.preventDefault();
    try{
            const response=await axios.get("http://localhost:1400/api/users/Chatbot")
            if(response.data.token){
             localStorage.getItem("token",response.data.token);
             axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
             console.log(response.data.token);
             console.log(response.data);
             setUsers(response.data);
             if(!response.data){
                           throw new Error("users data could not fetch");
             }
            }
    }catch(error){
              console.error("Error",error);
    }
    const userMessage = e.target.elements.message.value.trim();

    if (userMessage !== '') {
      const timestamp = new Date().toLocaleTimeString();
      setMessages((prevMessages) => [...prevMessages, { text: userMessage, type: 'user', time: timestamp }]);

      // Send user message via email
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
          // Generate bot response based on user's input
          const botResponse = generateBotResponse(userMessage);
          setMessages((prevMessages) => [...prevMessages, { text: botResponse, type: 'bot', time: timestamp }]);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });
    }

    e.target.reset(); // Reset the form
  };

   return (
    <div className={`chatbox-container ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
      {isOpen ? (
         <div className="chatbox-content">
         <div className="chatbox-header">
           <div className="user-info">
             <img
               src="https://img.freepik.com/free-photo/3d-portrait-businessman_23-2150793877.jpg?size=78&ext=jpg&ga=GA1.1.618472228.1700644440&semt=ais"
               alt="User Avatar"
               className="user-avatar"
             />
             {users.map(user=>(
              <p className="user-name">User Name<h3>{user.email}</h3></p>     
             ))}
            
           </div>
           <button className="close-button" onClick={handleToggleChatbox}>
             <i className="fas fa-times"></i>
           </button>
         </div>
         <div className="chatbox-thread">
           {messages.map((message, index) => (
             <div key={index} className={`message ${message.type}`}>
               <div className={`message-content ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
                 <p className="message-text">{message.text}</p>
                 <span className="message-time">{message.time}</span>
               </div>
             </div>
           ))}
         </div>
         <form onSubmit={handleSendMessage} className="chatbox-input">
           <div className="form-group">
             <textarea name="message" rows="1" placeholder="Type a message..." style={{color:"ButtonHighlight",backgroundColor:"black",marginLeft:"-20px"}} required />
             <button type="submit" className="send-button" style={{marginLeft:"-4px"}}>
             <i className="fa-solid fa-paper-plane"></i>
           </button>
           </div>
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

export default Chatbot;
