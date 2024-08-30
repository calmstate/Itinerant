import { openDB } from 'idb';
import React, { createContext, useReducer, useEffect } from "react";
import { defaultConfig } from "../Config/Default/default.config";
import { defaultAgents } from "../Config/Default/default.agents";

// Definição das ações
const SET_CONFIG = "SET_CONFIG";
const SET_AGENTS = "SET_AGENTS";
const RESET_ALL = "RESET_ALL";
const UPDATE_AGENT_HISTORY = "UPDATE_AGENT_HISTORY";
const ADD_AGENT = "ADD_AGENT";
const UPDATE_AGENT = "UPDATE_AGENT";
const DELETE_AGENT = "DELETE_AGENT";

// Estado inicial
const initialState = {
  config: defaultConfig,
  agents: defaultAgents,
};

// Criação dos contextos
export const GlobalStateContext = createContext(initialState);
export const GlobalDispatchContext = createContext(() => {});

// Reducer para gerenciar as ações
const globalReducer = (state, action) => {
  console.log('Reducer action:', action); // Log das ações para depuração
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
      // Verifica se o agente já existe antes de adicionar
      const agentExists = state.agents.some(agent => agent.id === action.payload.id);
      if (agentExists) {
        console.warn(`Agent with ID ${action.payload.id} already exists.`);
        return state; // Retorna o estado atual se o agente já existir
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

// Função para inicializar o IndexedDB
const initDB = async () => {
  return openDB('app-db', 1, {
    upgrade(db) {
      // Criação dos object stores
      db.createObjectStore('config');
      db.createObjectStore('agents');
    },
  });
};

// Provedor global que encapsula o estado e o dispatch
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  // Efeito para carregar os dados do IndexedDB na inicialização
  useEffect(() => {
    const fetchStorage = async () => {
      const db = await initDB();
      const storedConfig = await db.get('config', 'config');
      const storedAgents = await db.get('agents', 'agents');
      
      console.log('Stored Config:', storedConfig); // Log para depuração
      console.log('Stored Agents:', storedAgents); // Log para depuração
      
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
    };

    fetchStorage();
  }, []);

  // Efeito para salvar o estado `config` no IndexedDB sempre que ele mudar
  useEffect(() => {
    const saveConfig = async () => {
      const db = await initDB();
      await db.put('config', state.config, 'config');
    };
    saveConfig();
  }, [state.config]);

  // Efeito para salvar o estado `agents` no IndexedDB sempre que ele mudar
  useEffect(() => {
    const saveAgents = async () => {
      const db = await initDB();
      await db.put('agents', state.agents, 'agents');
    };
    saveAgents();
  }, [state.agents]);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};
