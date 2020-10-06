import config from 'shogunApplicationConfig';
import { AppInfo } from '../../Model/AppInfo';

class AppInfoService {

  constructor() {}

  static async getAppInfo(): Promise<AppInfo> {
    try {
      return fetch(config.path.appInfo).then(r => r.json());
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
export default AppInfoService;
