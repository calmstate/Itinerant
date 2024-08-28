import React from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";

export const FullScreenToggle = ({state, onToggle}) => {
    return (
        <div id="full-screen" onClick={onToggle}>
            {state ? <AiOutlineFullscreenExit size={30} /> : <AiOutlineFullscreen size={30} />}
        </div>
    );
}
