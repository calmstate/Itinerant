import React, { useState, useEffect, useContext } from "react";
import defaultUserPic from "../../../../Assets/bobby.svg";
import { GlobalStateContext, GlobalDispatchContext } from '../../../../Context/Context';

export const SidebarAgents = ({ handleSelectAgent, newAgentToggle }) => {
    const { agents, favorites } = useContext(GlobalStateContext);
    const dispatch = useContext(GlobalDispatchContext);

    // Inicializa a lista de agentes, garantindo que `agents` esteja definido
    const [agentsList, setAgentsList] = useState([]);

    useEffect(() => {
        if (agents) {
            setAgentsList(agents);
        }
    }, [agents]);

    // Função para alternar o estado de favorito
    const handleToggleFavorite = (agentId) => {
        // Ação para alternar o favorito deve ser definida no reducer
        dispatch({ type: 'TOGGLE_FAVORITE', payload: agentId });
    };

    return (
        <div id="app-sidebar-agents">
            {
                (agentsList.length > 0) ? 
                agentsList.map(agent => (
                    <div key={agent.id} className="agent" onClick={() => handleSelectAgent(agent)}>
                        <div className="agent-panel">
                            <div className="ascp-pic">
                                <img src={agent.info.image ? agent.info.image : defaultUserPic} alt="User Pic" />
                            </div>
                            <div className="ascp-text">
                                <div className="ascp-name">{agent.info.name}</div>
                                <div className="ascp-description">{agent.info.description}</div>
                            </div>
                        </div>
                        {/* <div className="mini-tools">
                            <IoPinSharp size={14} />
                            <div onClick={(e) => { 
                                e.stopPropagation(); 
                                handleToggleFavorite(agent.id); 
                            }}>
                                {favorites[agent.id] ? (
                                    <MdOutlineFavorite size={13} />
                                ) : (
                                    <MdFavoriteBorder size={13} />
                                )}
                            </div>
                            <IoRemoveCircleOutline size={14} />
                        </div> */}
                    </div>
                ))
                : 
                <div style={{
                        width: '100%', 
                        height: 120, 
                        color: "var(--app-content-text-color)",
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        padding: '25px', 
                        textAlign: 'center',
                        boxSizing: 'border-box',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        gap: '10px'
                    }}
                    onClick={newAgentToggle}
                >
                    <h3>Oops, looks like you're without any travelers.</h3>
                    <p>Click here and create a new one!</p>
                </div>
            }
        </div>
    );
};
