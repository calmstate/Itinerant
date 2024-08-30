import { openDB } from 'idb';
import React, { createContext, useReducer, useEffect, useCallback } from "react";
import { defaultConfig } from "../Config/Default/default.config";
import { defaultAgents } from "../Config/Default/default.agents";
import debounce from 'lodash.debounce';

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

const initDB = async () => {
  try {
    return openDB('app-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config');
        }
        if (!db.objectStoreNames.contains('agents')) {
          db.createObjectStore('agents');
        }
      },
    });
  } catch (error) {
    console.error('Failed to initialize the database:', error);
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const db = await initDB();
        const storedConfig = await db.get('config', 'config');
        const storedAgents = await db.get('agents', 'agents');

        if (storedConfig) {
          dispatch({ type: SET_CONFIG, payload: storedConfig });
        } else {
          await db.put('config', defaultConfig, 'config');
          dispatch({ type: SET_CONFIG, payload: defaultConfig });
        }
        if (storedAgents) {
          dispatch({ type: SET_AGENTS, payload: storedAgents });
        } else {
          await db.put('agents', defaultAgents, 'agents');
          dispatch({ type: SET_AGENTS, payload: defaultAgents });
        }
      } catch (error) {
        console.error('Failed to fetch storage:', error);
      }
    };

    fetchStorage();
  }, []);

  const saveAgents = useCallback(debounce(async (agents) => {
    try {
      const db = await initDB();
      await db.put('agents', agents, 'agents');
      console.log('Agents saved to IndexedDB:', agents);
    } catch (error) {
      console.error('Failed to save agents:', error);
    }
  }, 500), []);

  useEffect(() => {
    saveAgents(state.agents);
  }, [state.agents, saveAgents]);

  useEffect(() => {
    const saveConfig = async () => {
      try {
        const db = await initDB();
        await db.put('config', state.config, 'config');
      } catch (error) {
        console.error('Failed to save config:', error);
      }
    };
    saveConfig();
  }, [state.config]);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};
