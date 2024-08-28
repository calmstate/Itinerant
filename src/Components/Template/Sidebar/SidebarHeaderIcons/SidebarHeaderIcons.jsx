import React from "react";
import { RiSettingsLine } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa";

export const SidebarHeaderIcons = ({onNewAgent, onConfig}) =>{

    return (
        <div id="app-sidebar-header-icons">
            <RiSettingsLine size={20} id="settings-icon" className="icons" onClick={onConfig} />
            <FaUserPlus size={20} className="icons" style={{marginTop: '-1.7px'}} onClick={onNewAgent}/>
        </div>
    );
};