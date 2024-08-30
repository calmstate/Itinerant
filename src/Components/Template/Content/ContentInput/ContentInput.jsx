import React, { useState, useEffect, useRef } from 'react';
import { VscSend } from "react-icons/vsc";

export const ContentInput = ({ onSend, isEnable }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (isMobile) {
        e.preventDefault();
        setMessage(message + "\n");
      } else {
        e.preventDefault();
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (isEnable && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEnable]);

  return (
    <div id="app-content-input">
      <div id="aci-text">
        <textarea 
          placeholder={isEnable ? (isMobile ? 'Write your message here' : 'Press ENTER to send (or Shift+Enter for new line)') : 'Waiting for response...'}
          draggable="false" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} 
          disabled={!isEnable}
          ref={textareaRef} 
        ></textarea>
        <button 
          onClick={handleSend} 
          disabled={!isEnable}
        >
          <VscSend size={25} />
        </button>
      </div>
      <div id="aci-actions">
    
      </div>

    </div>
  );
};
