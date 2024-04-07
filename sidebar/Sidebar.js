import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, IconButton } from '@mui/material';
import SidebarChat from './Sidebarchat';
import Newchat from './Newchat';
import ProfileData from '../sidebar/ProfileData';
import axios from '../axios';

function Sidebar({userName, chats, keyy, newCurrentChat, newCanali, loggato}){
    const [usaerData, setUserData] = useState(false);
    const [key, setKey] = useState("");
    const [counter, setCounter] = useState(1);

    const [searchText, setSearchText] = useState('');
const [filteredChats, setFilteredChats] = useState(chats);


    const fetchData = async () => {
        try {
            const response = await axios.post("/api/v1/canali/sync", { name: userName });
            console.log(response.data);
        
            // Filtra i canali in base al nome utente
            const canaliFiltrati = response.data;
            console.log(canaliFiltrati);
        
            // Imposta lo stato con i canali filtrati
            newCanali(canaliFiltrati);
        } catch (error) {
            console.error("Errore nella richiesta API:", error);
        }
    };

    const handleSearch = (event) => {
        if(event.target.value === ""){
            fetchData();
        }
        const searchText = event.target.value;
        setSearchText(searchText);
    
        const filtered = chats.filter(chat => chat.name.toLowerCase().includes(searchText.toLowerCase()));
        newCanali(filtered);
    };
    

    if(loggato === true && counter !== 0){
        fetchData();
        setCounter(0);
    }else if(loggato === false){
        setCounter(1);
    }
    
    return(
        <div className='sidebar'>
            <div className="windowProfileData" onClick={() => {setUserData(false) }}>
                {usaerData && <ProfileData keys={keyy} />}
            </div>
            <div className='sidebar_header'>
                <div className='sidebar_header_left'>
                    <div className='profilePicture'  onClick={() => {setUserData(true)}}>
                        <Avatar src='data:image/jpeg;base64,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'></Avatar>
                    </div>
                    <div className='nametext'>
                        <h3>{userName}</h3>
                    </div>
                </div>
                <div className='sidebar_header_right'>
                    
                    <IconButton>
                        <DonutLargeIcon></DonutLargeIcon>
                    </IconButton>
                    
                    <IconButton>
                        <ChatIcon></ChatIcon>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon></MoreVertIcon>
                    </IconButton>
                    
                </div>
            </div>
            <div className='sidebar_search'>
                <div className='sidebar_search_container'>
                    <IconButton>
                        <SearchIcon></SearchIcon>
                    </IconButton>
                    <input 
            type='text' 
            placeholder='Cerca la chat' 
            value={searchText} 
            onChange={handleSearch} 
        />
                </div>
            </div>
            <div className='sidebar_chat'>
                
            {chats.map((chat) => (
                <SidebarChat 
                    nameChat={chat.name} 
                    setCurrentChat={newCurrentChat} 
                    
                />
            ))}

                
                
                <Newchat keys={keyy} name={userName}/>
                
            </div>
        </div>
    );
}

export default Sidebar