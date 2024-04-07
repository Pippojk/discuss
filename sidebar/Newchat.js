import React, { useState } from 'react';
import './Newchat.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from '../axios';

function Newchat({keys, name}) {
    const [visibile, setVisibile] = useState(true);

    const [input, setInput] = useState("");
    const [id, setId] = useState("");

    const newchat = async ()=>{
        console.log(visibile);
        console.log(keys);
        const newCanale = {
            partecipanti: [id, keys],
            name: input,
        }

        try{
            const response = await axios.post("/api/v1/canali", newCanale);
            console.log("Message sent:", response.data);
            setInput("");
            setVisibile(true);
            console.log(visibile);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div className="nuovachat">
            {visibile &&
                <div className="nuovachat_info" onClick={() => setVisibile(false)}>
                    <div className="nuovachat_info_testo" > 
                        <h1>nuova chat</h1>
                    </div>
                        <div className="nuovachat_info_avatar">
                        <AddCircleOutlineIcon />
                    </div>
                </div>
            }
            {!visibile &&
                <div className='chatChoose'> 
                    <input value={id} onChange={(e) => setId(e.target.value)} placeholder="inserire la key del user"></input>
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrivi il nome che vuoi dare alla chat" type="text"></input>
                    <button onClick={newchat}>Show Chat</button>
                    <button onClick={() => {setVisibile(true); setInput("");}}>back</button>
                </div>
            }
        </div>
    );
    
}

export default Newchat;
