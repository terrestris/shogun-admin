import Logger from '@terrestris/base-util/dist/Logger';
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
      const response = await fetch(config.path.swagger);
      if (!response.ok) {
        throw new Error('Could not fetch swagger API');
      }
      const json = await response.json();
      return json;
    } catch (error) {
      Logger.error(error);
      return Promise.reject(error);
    }
  }


}
export default AppInfoService;
