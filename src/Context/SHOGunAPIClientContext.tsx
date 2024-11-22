import React from 'react';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

export interface SHOGunAPIClientProviderProps {
  client: SHOGunAPIClient;
  children: JSX.Element;
}

export const SHOGunAPIClientContext = React.createContext<(SHOGunAPIClient | undefined)>(undefined);

export const SHOGunAPIClientProvider: React.FC<SHOGunAPIClientProviderProps> = ({
  client,
  children
}): JSX.Element => {
  return (
    <SHOGunAPIClientContext.Provider
      value={client}
    >
      {children}
    </SHOGunAPIClientContext.Provider>
  );
};

export default SHOGunAPIClientContext;
