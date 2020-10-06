import config from 'shogunApplicationConfig';
import { AppInfo } from '../../Model/AppInfo';
import { SwaggerDocs } from '../../Model/SwaggerDocs';

class AppInfoService {

  constructor() {}

  static async getAppInfo(): Promise<AppInfo> {
    try {
      return fetch(config.path.appInfo).then(r => r.json());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async getSwaggerDocs(): Promise<SwaggerDocs> {
    try {
      return fetch(config.path.swagger).then(r => r.json());
    } catch (error) {
      return Promise.reject(error);
    }
  }


}
export default AppInfoService;
