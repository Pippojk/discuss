import React, { useState } from 'react';
import './Login.css';
import axios from "../axios";

function Login({ updateLog, setUserName, setkey}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const verify = async (e) => {
    e.preventDefault();

    const credentials = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post("/api/v1/login", credentials);
      console.log(response.data);
      setUserName(response.data.username);
      setkey(response.data.key);
      console.log(response.data.key);

      updateLog('chat');
    } catch (error) {
      console.error("error sending message:", error);
    }
  };

  return (
    <form>
      <div className="login">
        <div className='back-btn'>
            <h1 onClick={() => {updateLog('back')}}>back</h1>
        </div>
        <div className="title">
          <h1>Login</h1>
        </div>

        <div className="input">
          <div className="email">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </div>
          <div className='button'>
            <h1 onClick={verify}>invia</h1>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
