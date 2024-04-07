import React, { useEffect, useState } from 'react';
import './ProfileData.css';

function ProfileData({keys}){
    useEffect(()=>{
        console.log(keys);
    })

    return(
        <div className='credenziali'>
            <button>cambia imagine profilo</button>

            <h2>id: {keys}</h2>
        </div>
    );
}

export default ProfileData