import { useContext } from 'react';

import PluginContext from '../Context/PluginContext';

import { AdminPluginInternal } from '../plugin';

export const usePlugins = (): AdminPluginInternal[] => {
  return useContext(PluginContext);
};

export default usePlugins;
