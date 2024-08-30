import React from "react";
import Markdown from 'react-markdown';
import { Acc } from "../Template/Acc/Acc";
import { AccBody } from "../Template/Acc/Body/AccBody";
import { ChatHeader } from "../Template/Header/Header/Header";
import { HeaderTools } from "../Template/Header/HeaderTools/HeaderTools";
import { HeaderName } from "../Template/Header/HeaderName/HeaderName";
export const ChatAgent = ({name, message}) =>{

    return (
        <Acc agent={true}>
            <ChatHeader>
                <HeaderName name={name} />
                <HeaderTools agent={true}/>
            </ChatHeader>
            <AccBody agent={true}>
                <Markdown>{message}</Markdown>
            </AccBody>
        </Acc>
    );
};