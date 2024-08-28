import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

export const Modal = ({ children, icon, title, subTitle, buttons, onClose }) =>{

    return (
        <div id="modal">
        <div id="modal-card">
            <div id="modal-card-header">
                <div id="mch-icon">
                  {icon}
                </div>
                <div id="mch-title">
                  <h3>{title}</h3>
                  <p>{subTitle}</p>
                </div>
                <div id="mch-close" onClick={onClose}>
                  <IoCloseCircleOutline size={30} />
                </div>
            </div>
            <div id="modal-card-body">
                {children}
            </div>
            <div id="modal-card-footer">
               <div id="mcf-buttons">
                   {
                        buttons.map(button =><button onClick={button.onClick}>{button.name}</button>)
                   }
               </div>
            </div>
        </div>
    </div>
    );
};