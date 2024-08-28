import React from "react";
import Markdown from 'react-markdown'
export const ChatUser = ({name, message}) =>{
    const removeTags = (input) =>{
        return input.replace(/<[^>]*>:/g, '');
    }
    return (
        <div className="acc-user">
            <div className="acc-user-header">
                <p>{name}:</p>
            </div>
            <div className="acc-user-body">
                 <Markdown>{removeTags(message)}</Markdown>
            </div>
        </div>
    );
};