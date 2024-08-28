import React from 'react';

export const Main = ({children, fullScreen}) =>{

    return (
        <div id="app" class={ fullScreen && "full-screen"}>{children}</div>
    );

};