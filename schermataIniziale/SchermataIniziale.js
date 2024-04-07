import React from "react";
import "./Schermatainiziale.css";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

function Schermatainiziale({ updateLog }) {
    return (
        <div className="bigContainer">
            <h1>benvenuto</h1>
            <div className="container">
                <div className="piu">
                    <GroupAddOutlinedIcon className="circle" />
                </div>
                <div className="log">
                    <h1 onClick={() => {updateLog('login')}}>login</h1>
                    <p>or</p>
                    <h1 onClick={() => {updateLog('signup')}}>sign up</h1>
                </div>
            </div>
        </div>
    );
}

export default Schermatainiziale;
