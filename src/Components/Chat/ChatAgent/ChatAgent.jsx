import React from "react";
import Markdown from 'react-markdown'

export const ChatAgent = ({name, message}) =>{

    return (
        <div className="acc-agent">
            <div className="acc-agent-header">
                <p>{name}:</p>
            </div>
            <div className="acc-agent-body">
               <Markdown>{message}</Markdown>
            </div>
        </div>
    );
};