import React from "react";
import { CiMenuBurger } from "react-icons/ci";

export const SidebarToggle = ({onClick}) =>{

    return (
          <div id="menu-icon" onClick={onClick}>
             <CiMenuBurger size={20} className="icons" />
          </div>
    );

};