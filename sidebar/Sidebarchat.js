import React from 'react';
import './Sidebarchat.css';
import { Avatar, IconButton } from '@mui/material';

const SidebarChat = ({ nameChat, setCurrentChat }) => {
    return (
        <div className="sidebarchat" onClick={() => setCurrentChat(nameChat)}>
            <Avatar></Avatar>
            <div className="sidebarchat_info">
                <h1>{nameChat}</h1>
                <p>message</p> 
            </div>
        </div>
    );
}

export default SidebarChat;
