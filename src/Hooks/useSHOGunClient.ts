import {
  useContext
} from 'react';

import SHOGunClient from '@terrestris/shogun-util/dist/service/SHOGunClient';

import SHOGunClientContext from '../Context/SHOGunClientContext';

export const useSHOGunClient = (): SHOGunClient => {
  const context = useContext(SHOGunClientContext);

  return context;
};

export default useSHOGunClient;
