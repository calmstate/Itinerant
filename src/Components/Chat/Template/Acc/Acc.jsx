import React from "react";

export const Acc = ({children, agent}) =>{

    return (
        <div className={`acc ${agent ? 'acc-agent' : 'acc-user'}`}>
            {children}
        </div>
    )

};