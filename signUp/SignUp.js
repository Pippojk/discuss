import React, { useState } from 'react';
import './SignUp.css';
import axios from "../axios";

function SignUp({updateLog}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [doppi, setDoppi] = useState(false);
  const [passwordEqual, setPasswordEqual] = useState(true);

  const submit = async (e) => {
    e.preventDefault();

    if(password === passwordConfirm){
      setPasswordEqual(true);
      const newLog = {
        passwordConfirm: passwordConfirm,
        key: username,
        username: username,
        email: email,
        password: password
      }

      try{
        const response = await axios.post("/api/v1/signup", newLog);
        console.log("Message sent:", response.data);
        updateLog('login');
        setDoppi(false);
      }catch (error){
        console.error("error sending message:", error);

        if (error.response && error.response.status === 500 && error.response.data.code === 11000) {
          console.error("Duplicate key error:", error.response.data);
          setDoppi(true);
        }
      }
      
    }else{
      setPasswordEqual(false);
    }
    
  }

  return (
    <form>
      <div className="signUp">
        <div className='back-btnS'>
            <h1 onClick={() => {updateLog('back')}}>back</h1>
        </div>
        <div className="titleS">
          <h1>sign up</h1>
          {doppi && <h2>email o username gia in uso</h2>}
          {passwordEqual === false && <h2>le password non corrispondono</h2>}
        </div>

        <div className="inputS">
          <div className="name">
            <label htmlFor="name">name</label>
            <input type="text" id="name" placeholder="Enter your name" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
          </div>
          <div className="emailS">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="passwordS">
            <label htmlFor="password" >Password</label>
            <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="Confpassword">
            <label htmlFor="Confpassword"> conferm Password</label>
            <input type="password" id="password" placeholder="conferm the password password" value={passwordConfirm} onChange={(e)=>{setPasswordConfirm(e.target.value)}}/>
          </div>
           
          <div className='button'>
            <h1 onClick={!doppi ? submit : undefined}>invia</h1>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignUp;