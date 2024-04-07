import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './sidebar/Sidebar';
import Login from './logjn/Login';
import Chat from './chat/Chat';
import SignUp from './signUp/SignUp';
import Schermatainiziale from './schermataIniziale/SchermataIniziale';
import Pusher from 'pusher-js';

import axios from './axios';

function App() {
  const [chat, setChat] = useState(false);
  const [iniziale, setIniziale] = useState(true);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  const [messages, setMessages] = useState([]);
  const [canali, setCanali] = useState([]);

  const [currentChat, setCurrentChat] = useState("");
  const change = (nuovoStato) => {
    setChat(false);
    setLogin(false);
    setIniziale(false);
    setSignup(false);
    
    if (nuovoStato === 'chat') {
      setChat(true);
    } else if (nuovoStato === 'login') {
      setLogin(true);
    } else if (nuovoStato === 'signup') {
      setSignup(true);
    } else {
      setIniziale(true);
    }
  };

  
  

  useEffect(() => {
    console.log("effect app");
    
    var pusher = new Pusher('89e7c6c80abcceb3d383', {
      cluster: 'eu'
    });
          
    console.log(currentChat);
    var channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      // Utilizza una funzione di aggiornamento dello stato per garantire una corretta gestione dell'aggiornamento
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("effect app 2");

    var pusher = new Pusher('4bf11ef876d967bc1dd9', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe('channels');
    channel.bind('inserted', function(newMessage){
      setCanali((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, []);

  return (
    <div className="app">
      <div className="app_body">
        {iniziale && <Schermatainiziale updateLog={change} />}
        {chat && <Sidebar userName={name} chats={canali} keyy={key} newCurrentChat={setCurrentChat}  newCanali={setCanali} loggato={chat}/>}
        {(chat && currentChat != "")  && <Chat messages={messages} userName={name} currentchat={currentChat} newMessages={setMessages}/>}
        {login && <Login updateLog={change} setUserName={setName} setkey={setKey}/>}
        {signup && <SignUp updateLog={change}/>}
      </div>
    </div>
  );
}

export default App;
