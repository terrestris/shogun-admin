import {
  useContext
} from 'react';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

import SHOGunAPIClientContext from '../Context/SHOGunAPIClientContext';

export const useSHOGunAPIClient = (): SHOGunAPIClient => {
  const context = useContext(SHOGunAPIClientContext);

  return context;
};

export default useSHOGunAPIClient;
