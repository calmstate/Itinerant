import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AppWrap } from './Components/Template/AppWrap/AppWrap';
import { Main } from './Components/Template/Main/Main.jsx';
import { FullScreenToggle } from './Components/Toggles/FullScreenToggle/FullScreenToggle';
import { SidebarToggle } from './Components/Toggles/SidebarToggle/SidebarToggle';
import { Sidebar } from './Components/Template/Sidebar/Sidebar/Sidebar.jsx';
import { SidebarHeader } from './Components/Template/Sidebar/SidebarHeader/SidebarHeader.jsx';
import { Logo } from './Components/Logo/Logo.jsx';
import { SidebarHeaderIcons } from './Components/Template/Sidebar/SidebarHeaderIcons/SidebarHeaderIcons.jsx';
import { SidebarContent } from './Components/Template/Sidebar/SidebarContent/SidebarContent.jsx';
import { SearchBar } from './Components/SearchBar/SearchBar.jsx';
import { SidebarAgents } from './Components/Template/Sidebar/SidebarAgents/SidebarAgents.jsx';
import { Content } from './Components/Template/Content/Content/Content.jsx';
import { ContentSub } from './Components/Template/Content/ContentSub/ContentSub.jsx';
import { NoAgent } from './Components/Template/Content/NoAgent/NoAgent.jsx';
import { ConfigModal } from './Components/Modals/Config/ConfigModal.jsx';
import { NewAgent } from './Components/Modals/NewAgent/NewAgent.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOllamaModels } from './LLM/Ollama/Ollama.js';
import { GlobalStateContext, GlobalDispatchContext } from './Context/Context.js';

export default function App() {
  const dispatch = useContext(GlobalDispatchContext);
  const { config, agents } = useContext(GlobalStateContext);

  const [menuState, setMenuState] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [agent, setAgent] = useState(null);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [configModal, setConfigModal] = useState(false);
  const [newAgentModal, setNewAgentModal] = useState(false);
  const [modelList, setModelList] = useState([]);
  const [runOllama, setRunOllama] = useState(false);
  const [editAgentToggle, setEditAgentToggle] = useState(false);
  const [chooseModelToggle, setChooseModelToggle] = useState(false);

  const fetchOllamaModelsList = useCallback(async () => {
    const getModelList = await getOllamaModels(config);
    if (getModelList.models) {
      setModelList(getModelList.models.map(e => e.name));
    } else {
      setRunOllama(true);
    }
  }, []);

  useEffect(() => {
    fetchOllamaModelsList();
  }, [fetchOllamaModelsList]);

  useEffect(() => {
    setFilteredAgents(agents);
  }, [agents]);

  useEffect(() => {
    if (config?.ollama?.model === "") {
      setChooseModelToggle(true);
    } else {
      setChooseModelToggle(false); 
    }
  }, [config]);
  

  const handleOnFound = (foundAgents) => setFilteredAgents(foundAgents);

  const toggleMenuState = () => setMenuState((prev) => !prev);

  const toggleFavorite = (agentId) =>
    setFavorites((prevState) => ({
      ...prevState,
      [agentId]: !prevState[agentId],
    }));

  const handleSelectAgent = (agent) => {
    setAgent(agent);
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setMenuState(false);
    }
  };

  const handleEditAgent = () => setEditAgentToggle(true);

  const handleClearChat = () => {
    if (agent) {
      const updatedHistory = [];
      setAgent({ ...agent, history: updatedHistory });
      dispatch({
        type: 'UPDATE_AGENT_HISTORY',
        payload: { id: agent.id, history: updatedHistory },
      });
    }
  };

  const toggleFullScreen = () => setFullScreen((prev) => !prev);

  const openConfigModal = () => setConfigModal(true);
  const openNewAgentModal = () => setNewAgentModal(true);

  const handleReset = () => {
    dispatch({ type: 'RESET_ALL' });
    setAgent(null);
    setConfigModal(false);
    toast('Settings and Agents deleted.');
  };

  const handleSave = (newConfig) => {
    dispatch({ type: 'SET_CONFIG', payload: newConfig });
    setConfigModal(false);
    toast('Settings saved.');
  };

  const handleNewAgent = (newAgent) => {
    dispatch({ type: 'ADD_AGENT', payload: newAgent });
    setNewAgentModal(false);
    toast(`${newAgent.info.name} created!`);
  };

  const handleUpdateAgent = (updatedAgent) => {
    dispatch({ type: 'UPDATE_AGENT', payload: updatedAgent });
    setAgent(updatedAgent);
    setEditAgentToggle(false);
    toast(`${updatedAgent.info.name} updated!`);
  };

  const handleDeleteAgent = (agentId) => {
    dispatch({ type: 'DELETE_AGENT', payload: agentId });
    setAgent(null);
    toast(`${agent.info.name} deleted!`);
  };

  return (
    <AppWrap>
      {runOllama && (
        <div id="run-ollama-first">
          <p>
            <b>Before using the Itinerant, run Ollama.</b>
          </p>
          <p>After running Ollama, reload the page.</p>
          <button className="btn" style={{ width: 100 }} onClick={() => setRunOllama(false)}>
            Done!
          </button>
        </div>
      )}
      {chooseModelToggle && (
        <div id="run-ollama-first">
          <h2>Choose a model</h2>
          <p>To use ITI we need to define a model. Make sure you have downloaded models through Ollama.</p>
          <button
            className="btn"
            style={{ width: 130 }}
            onClick={() => {
              setConfigModal(true);
              setChooseModelToggle(false);
            }}
          >
            Let me choose!
          </button>
        </div>
      )}
      <Main fullScreen={fullScreen}>
        <FullScreenToggle state={fullScreen} onToggle={toggleFullScreen} />
        <SidebarToggle onClick={toggleMenuState} />
        <Sidebar menuState={menuState}>
          <SidebarHeader>
            <Logo />
            <SidebarHeaderIcons onConfig={openConfigModal} onNewAgent={openNewAgentModal} />
          </SidebarHeader>
          <SidebarContent>
            <SearchBar agents={agents} onFound={handleOnFound} />
            <SidebarAgents
              agents={filteredAgents}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              handleSelectAgent={handleSelectAgent}
              newAgentToggle={() => setNewAgentModal(true)}
            />
          </SidebarContent>
        </Sidebar>
        <Content>
          {agent ? (
            <ContentSub
              agent={agent}
              config={config}
              handleEditAgent={handleEditAgent}
              handleClearChat={handleClearChat}
              handleDeleteAgent={handleDeleteAgent}
            />
          ) : (
            <NoAgent />
          )}
        </Content>
        <ToastContainer />
      </Main>

      {configModal && (
        <ConfigModal
          onClose={() => setConfigModal(false)}
          config={config}
          onReset={handleReset}
          onSave={handleSave}
          modelList={modelList}
        />
      )}
      {newAgentModal && <NewAgent onClose={() => setNewAgentModal(false)} onCreate={handleNewAgent} />}
      {editAgentToggle && (
        <NewAgent agent={agent} onClose={() => setEditAgentToggle(false)} onUpdate={handleUpdateAgent} />
      )}
    </AppWrap>
  );
}