import React from 'react';
import { FaRegEdit, FaRegClone } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { BsGeoAlt } from "react-icons/bs";
import { TbMessageLanguage } from "react-icons/tb";
import defaultUserPic from "../../Assets/bobby.png";
 

export default function AgentDetails({ agent }) {
    return (
        <div id="app-content-sub">
            <div id="app-content-header">
                <div id="ach-agent-info">
                    <div className="ascp-pic-extra">
                        <img src={agent.info.image ? agent.info.image : defaultUserPic} alt="Agent" />
                    </div>
                    <div id="ach-agent-text">
                        <h1 id="agent-name">{agent.info.name}</h1>
                        <h2>{agent.info.description}</h2>
                        <ul>
                            <li>
                                <div>
                                    <p style={{fontSize: 10}}><BsGeoAlt size={15} /> {agent.country?.name}</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p style={{fontSize: 10}}><TbMessageLanguage size={15} /> {agent.country?.language}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id="ach-agent-actions">
                        <FaRegEdit size={19} />
                        <FaRegClone size={19} />
                        <FaDeleteLeft size={19} />
                    </div>
                </div>
            </div>
        </div>
    );
}
