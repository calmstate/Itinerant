import React from "react";
import Markdown from 'react-markdown';
import { Acc } from "../Template/Acc/Acc";
import { AccBody } from "../Template/Acc/Body/AccBody";
import { ChatHeader } from "../Template/Header/Header/Header";
import { HeaderTools } from "../Template/Header/HeaderTools/HeaderTools";
import { HeaderName } from "../Template/Header/HeaderName/HeaderName";

export const ChatUser = ({name, message}) =>{
    const removeTags = (input) =>{
        return input.replace(/<[^>]*>:/g, '');
    }
    return (
        <Acc agent={false}>
            <ChatHeader>
                <HeaderName name={name} />
                <HeaderTools/>
            </ChatHeader>
            <AccBody agent={false}>
                <Markdown>{removeTags(message)}</Markdown>
            </AccBody>
        </Acc>
    );
};