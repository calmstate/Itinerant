import React, { useEffect, useState, useRef } from 'react';
import { ChatAgent } from '../../../Chat/ChatAgent/ChatAgent';
import { ChatUser } from '../../../Chat/ChatUser/ChatUser.jsx';

export const ContentChat = ({messages, agent, onConfig}) => {

  const [config, setConfig] = useState({});
  const chatContainerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setConfig(onConfig);
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  }, [onConfig]);

  useEffect(() => {
    (async () =>{
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    })();
  }, [messages]);

  return (
    <div 
      id="app-content-chat" 
      ref={chatContainerRef} 
      style={{ 
        overflowY: 'auto', 
        height: '100%', 
        scrollBehavior: 'smooth'  
      }}
    >
      {
        messages.map((message, index) => (
          message.role === 'user' ? 
            <ChatUser 
              key={index}
              name={config.user?.name || 'User'}
              message={message.content}
            /> : message.role === 'assistant' &&
            <ChatAgent 
              key={index}
              name={agent?.info?.name || 'Agent'}
              message={message.content}
            />
        ))
      }
    </div>
  );
};
