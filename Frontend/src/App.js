import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Email from "./components/Email";
import Chat from "./components/Chat";

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Email" element={<Email/>}/>
          <Route path="/Chat" element={<Chat/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
