import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';
import { useContext } from 'react';

import SHOGunAPIClientContext from '../Context/SHOGunAPIClientContext';

export const useSHOGunAPIClient = (): SHOGunAPIClient | undefined => {
  return useContext(SHOGunAPIClientContext);
};

export default useSHOGunAPIClient;
