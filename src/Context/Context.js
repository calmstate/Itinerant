import React, { createContext, useReducer, useEffect } from "react";
import { defaultConfig } from "../Config/Default/default.config";
import { defaultAgents } from "../Config/Default/default.agents";

const SET_CONFIG = "SET_CONFIG";
const SET_AGENTS = "SET_AGENTS";
const RESET_ALL = "RESET_ALL";
const UPDATE_AGENT_HISTORY = "UPDATE_AGENT_HISTORY";
const ADD_AGENT = "ADD_AGENT";
const UPDATE_AGENT = "UPDATE_AGENT";
const DELETE_AGENT = "DELETE_AGENT";

const initialState = {
  config: defaultConfig,
  agents: defaultAgents,
};

export const GlobalStateContext = createContext(initialState);
export const GlobalDispatchContext = createContext(() => {});

const globalReducer = (state, action) => {
  console.log('Reducer action:', action); 
  switch (action.type) {
    case SET_CONFIG:
      return { ...state, config: action.payload };
    case SET_AGENTS:
      return { ...state, agents: action.payload };
    case RESET_ALL:
      return { config: defaultConfig, agents: defaultAgents };
    case UPDATE_AGENT_HISTORY:
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? { ...agent, history: action.payload.history } : agent
        )
      };
    case ADD_AGENT:
      const agentExists = state.agents.some(agent => agent.id === action.payload.id);
      if (agentExists) {
        console.warn(`Agent with ID ${action.payload.id} already exists.`);
        return state; 
      }
      return {
        ...state,
        agents: [...state.agents, action.payload]
      };
    case UPDATE_AGENT:
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? { ...agent, ...action.payload } : agent
        )
      };
    case DELETE_AGENT:
      return {
        ...state,
        agents: state.agents.filter(agent => agent.id !== action.payload)
      };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    const fetchStorage = async () => {
      const storedConfig = localStorage.getItem('it-config');
      const storedAgents = localStorage.getItem('it-agents');
      
      console.log('Stored Config:', storedConfig); 
      console.log('Stored Agents:', storedAgents); 
      
      if (storedConfig && storedConfig !== 'null' && storedConfig !== 'undefined') {
        dispatch({ type: SET_CONFIG, payload: JSON.parse(storedConfig) });
      } else {
        localStorage.setItem('it-config', JSON.stringify(defaultConfig));
        dispatch({ type: SET_CONFIG, payload: defaultConfig });
      }
      if (storedAgents && storedAgents !== 'null' && storedAgents !== 'undefined') {
        dispatch({ type: SET_AGENTS, payload: JSON.parse(storedAgents) });
      } else {
        localStorage.setItem('it-agents', JSON.stringify(defaultAgents));
        dispatch({ type: SET_AGENTS, payload: defaultAgents });
      }
    };

    fetchStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem('it-config', JSON.stringify(state.config));
  }, [state.config]);

  useEffect(() => {
    localStorage.setItem('it-agents', JSON.stringify(state.agents));
  }, [state.agents]);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};
