import React, {
  JSX
} from 'react';

import {
  AdminPluginInternal
} from '../plugin';

export interface PluginProviderProps {
  plugins: AdminPluginInternal[];
  children: JSX.Element;
}

export const PluginContext = React.createContext<(AdminPluginInternal[])>([]);

export const PluginProvider: React.FC<PluginProviderProps> = ({
  plugins,
  children
}): JSX.Element => {
  return (
    <PluginContext.Provider
      value={plugins}
    >
      {children}
    </PluginContext.Provider>
  );
};

export default PluginContext;
