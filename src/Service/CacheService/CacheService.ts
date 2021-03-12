import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

import Logger from '../../Logger';

import config from 'shogunApplicationConfig';

class CacheService {

  constructor() {}

  async evictCache(): Promise<boolean> {
    try {
      const response = await fetch(`${config.path.evictCache}`, {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
        }
      });

      return response.status === 200;
    } catch(error) {
      Logger.error(`Error while evicting the cache: ${error}`);

      return false;
    }
  };

}

export default CacheService;
