import React from 'react';
import { IoPinSharp } from "react-icons/io5";
import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { IoRemoveCircleOutline } from "react-icons/io5";
import defaultUserPic from "../../Assets/default_user_pic.svg";

export default function AgentList({agents, toggleFavorite, onSelectAgent, favorites}) {
    return (
        <div id="app-sidebar-agents">
            {agents.map(agent => (
                <div key={agent.id} className="agent" onClick={() => onSelectAgent(agent)}>
                    <div className="agent-panel">
                        <div className="ascp-pic">
                            <img src={agent.info.image ? agent.info.image : defaultUserPic} alt="Agent" />
                        </div>
                        <div className="ascp-text">
                            <div className="ascp-name">{agent.info.name}</div>
                            <div className="ascp-description">{agent.info.description}</div>
                        </div>
                    </div>
                    <div className="mini-tools">
                        <IoPinSharp size={14} />
                        <div onClick={() => toggleFavorite(agent.id)}>
                            {favorites[agent.id] ? (
                                <MdOutlineFavorite size={13} />
                            ) : (
                                <MdFavoriteBorder size={13} />
                            )}
                        </div>
                        <IoRemoveCircleOutline size={14} />
                    </div>
                </div>
            ))}
        </div>
    );
}
