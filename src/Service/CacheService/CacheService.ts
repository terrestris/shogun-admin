import Logger from '../../Logger';

import config from 'shogunApplicationConfig';
import SecurityUtil from '../../Util/SecurityUtil';

class CacheService {

  constructor() {}

  async evictCache(): Promise<boolean> {
    try {
      const response = await fetch(`${config.path.evictCache}`, {
        method: 'POST',
        headers: SecurityUtil.getSecurityHeaders(config)
      });
      return response.status === 200;
    } catch (error) {
      Logger.error(`Error while evicting the cache: ${error}`);

      return false;
    }
  };

}

export default CacheService;
