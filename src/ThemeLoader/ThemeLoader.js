import React, { useContext, useEffect } from 'react';
 
import { GlobalStateContext } from '../Context/Context';

const ThemeLoader = ({ children }) => {
  const { config } = useContext(GlobalStateContext);

  useEffect(() => {
    const { name, mode } = config.interface.theme;
    
    import(`../Styles/Themes/${name}/${mode}/${name.toLowerCase()}.${mode.toLowerCase()}.css`)
      .catch(err => {
        console.error('Erro ao carregar o tema:', err);
      });
  }, [config.interface.theme]);

  return (
    <div id={`${config.interface.theme.mode.toLowerCase()}`}>
      {children}
    </div>
  );
};

export default ThemeLoader;
