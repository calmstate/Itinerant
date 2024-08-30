import React from "react";

export const AccBody = ({children, agent}) =>{

    return (
        <div className={`acc-body ${agent ? 'acc-body-agent' : 'acc-body-user'}`}>
            {children}
        </div>
    )

};