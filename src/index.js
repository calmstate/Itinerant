import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../src/Styles/Globals.css';
import { GlobalProvider } from './Context/Context';
import ThemeLoader from './ThemeLoader/ThemeLoader.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
 
root.render(
  <GlobalProvider>
    <ThemeLoader>
      <App />
    </ThemeLoader>
  </GlobalProvider>
);
