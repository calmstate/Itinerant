import React from "react";

export const Sidebar = ({children, menuState}) =>{

    return (
        <div id="app-sidebar" className={!menuState && "closed"}>
            {children}
        </div>
    );

};