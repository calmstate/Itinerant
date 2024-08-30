import React, { useState, useEffect, useContext } from 'react';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { ContentChat } from '../ContentChat/ContentChat';
import { ContentInput } from '../ContentInput/ContentInput';
import { GlobalDispatchContext } from '../../../../Context/Context.js';
import { getOllamaResponse } from "../../../../LLM/Ollama/Ollama.js";
import { commonPrompt } from "../../../../Config/PromptCollection.js";

export const ContentSub = ({ config, agent, handleEditAgent, handleCloneAgent, handleClearChat, handleDeleteAgent }) => {
  const [messages, setMessages] = useState([]);
  const [inputIsEnable, setInputIsEnable] = useState(true);

  const dispatch = useContext(GlobalDispatchContext);  

  useEffect(() => {
    (async () => {
     
      const systemPrompt = {
        role: "system",
        content: commonPrompt(
          agent.info.name, 
          agent.country.name, 
          agent.country.language,
          agent.system.prompt)
      };
      const initialMessage = {
        role: "assistant",
        type: "initial",
        content: agent.system.initial
      };

      let newMessages = agent.history && agent.history.length > 0 ? [...agent.history] : [];

      const systemPromptIndex = newMessages.findIndex(message => message.role === "system");
      if (systemPromptIndex !== -1) {
        newMessages[systemPromptIndex] = systemPrompt;
      } else {
        newMessages = [systemPrompt, ...newMessages];
      }

      const historyContainsInitialMessage = newMessages.some(
        message => message.role === "assistant" && message.type === "initial" && message.content === agent.system.initial
      );

      if (!historyContainsInitialMessage) {
        newMessages = agent.system.initial !== "" ? [initialMessage, ...newMessages] : [...newMessages];
      }

      setMessages(newMessages);
    })();
  }, [agent]);

  const handleUserInput = async (message) => {
    setInputIsEnable(false);
    const messageFormatted = {
      role: "user",
      content: `<${config.user.name}>: ${message}`
    };
    setMessages([...messages, messageFormatted]);
  };

  const handleAgentResponse = async () => {
    const agentResponse = await getOllamaResponse(messages, config);

    const messageFormatted = {
      role: "assistant",
      content: agentResponse
    };

    const newMessages = [...messages, messageFormatted];
    setMessages(newMessages);
    setInputIsEnable(true);

    dispatch({ type: 'UPDATE_AGENT_HISTORY', payload: { id: agent.id, history: newMessages } });
  };

  useEffect(() => {
    (async () => {
      if (messages.length < 1) return;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        await handleAgentResponse();
      }
    })();
  }, [messages]);

  return (
    <div id="app-content-sub">
      <ContentHeader 
        agent={agent} 
        handleEditAgent={handleEditAgent} 
        handleCloneAgent={handleCloneAgent} 
        handleClearChat={handleClearChat}
        handleDeleteAgent={() => handleDeleteAgent(agent.id)}
      />
      <ContentChat 
        messages={messages}
        agent={agent}
        onConfig={config}
      />
      <ContentInput 
        onSend={(m) => handleUserInput(m)}
        isEnable={inputIsEnable}
      />
    </div>
  );
};
