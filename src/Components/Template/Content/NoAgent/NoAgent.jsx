import React from 'react';
import character from "../../../../Assets/bobby.svg";

export const NoAgent = () => {
  return (
    <div id="no-agent">
      <img src={character} style={{width: 220}} />
      <p style={{fontWeight: 'medium', color: 'var(--app-content-text-color)'}}>Select a traveler</p>
      <p style={{fontWeight: '100', color: 'var(--app-content-text-color)'}}>And start your itinerary by chatting.</p>
    </div>
  );
};
