import React from 'react';
import { BsGeoAlt } from "react-icons/bs";
import { TbMessageLanguage } from "react-icons/tb";
import { FaRegEdit, FaRegClone } from "react-icons/fa";
import { AiOutlineClear } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import defaultUserPic from "../../../../Assets/bobby.svg"

export const ContentHeader = ({ agent, handleEditAgent, handleClearChat, handleDeleteAgent }) => {
  return (
    <div id="app-content-header">
      <div id="ach-agent-info">
        <div className="ascp-pic-extra">
          <img src={agent.info.image ? agent.info.image : defaultUserPic} />
        </div>
        <div id="ach-agent-text">
          <h1 id="agent-name">{agent.info.name}</h1>
          <h2>{agent.info.description || "No description"}</h2>
          <ul>
            <li><p style={{fontSize: 10}}><BsGeoAlt size={15} /> {agent.country?.name || "N/A"}</p></li>
            <li><p style={{fontSize: 10}}><TbMessageLanguage size={15} /> {agent.country?.language || "N/A"}</p></li>
          </ul>
        </div>
        <div id="ach-agent-actions">
        {/* <FaRegClone size={19} onClick={handleCloneAgent}/> */}
          <FaRegEdit size={19} onClick={handleEditAgent}/>
          <AiOutlineClear  size={24} onClick={handleClearChat}/>
          <RiDeleteBin6Line  size={22} onClick={handleDeleteAgent}/>
        </div>
      </div>
    </div>
  );
};
