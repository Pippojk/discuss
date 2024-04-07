import React, { useEffect, useState } from "react";
import "./Chat.css";
import axios from "../axios";
import { Avatar, IconButton } from "@mui/material";
import { AttachFile, EmojiEmotions, EmojiEmotionsOutlined, MoreVert, SearchOutlined } from "@mui/icons-material";
import { Types as mongooseTypes } from "mongoose";

function Chat({ messages, userName, currentchat, newMessages}){
    const [input, setInput] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        console.log(currentchat);
        const newMessage = {
            message: input,
            name: userName,
            recived: true,
            chatName: currentchat
        };

        try {
            newMessages([...messages, newMessage]);
            const response = await axios.post("/api/v1/messages", newMessage);
            console.log("Message sent:", response.data);
            setInput("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const loadMessages = ()=>{
      axios.post("/api/v1/messages/sync", {nameChat: currentchat})
      .then((response) => {
        newMessages(response.data);// Aggiorna lo stato con i messaggi ottenuti dalla chiamata API
        console.log(currentchat); 
      })
      .catch((error) => {
        console.error('Errore nella richiesta API:', error);
      });
    }

    useEffect(() => {
        loadMessages();
        
      }, [currentchat]);

    return(
        <div className="chat">
            <div className="chat_header">
                <Avatar></Avatar>
                <div className="chatheaderinfo">
                    <h3>{currentchat}</h3>
                    <p>Visto lultima...</p>
                </div>
                <div className="chatheaderright">
                    <IconButton>
                        <SearchOutlined></SearchOutlined>
                    </IconButton>
                    <IconButton>
                        <AttachFile></AttachFile>
                    </IconButton>
                    <IconButton>
                        <MoreVert></MoreVert>
                    </IconButton>
                </div>
            </div>
            <div className="chat_body">
            {messages
            .filter(message => message.chatName === currentchat)
            .map((message) => (
             <p key={message._id} className={`chatmessage ${message.recived && "chatreceiver"}`}>
                <span className="chatname">{message.name}</span>
                {message.message}
                <span className="chattimestamp">{message.timestamp}</span>
              </p>
            ))}
            </div>
            <div className="chat_footer">
                <IconButton>
                    <EmojiEmotionsOutlined></EmojiEmotionsOutlined>
                </IconButton>
                <form >
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrivi un messaggio" type="text"></input>
                    <button onClick={sendMessage} type="submit">invia un messaggio</button>
                </form>
            </div>
        </div>
    );
}

export default Chat;