import React from 'react';
import { VscSend } from "react-icons/vsc";

export default function InputArea() {
    return (
        <div id="app-content-input">
            <div id="aci-text">
                <textarea 
                    placeholder='Press CTRL + ENTER to send'
                    draggable="false"
                ></textarea>
                <button><VscSend size={25}/></button>
            </div>
        </div>
    );
}
