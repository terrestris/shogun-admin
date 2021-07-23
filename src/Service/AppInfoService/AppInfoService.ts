import config from 'shogunApplicationConfig';
import { AppInfo } from '../../Model/AppInfo';
import { SwaggerDocs } from '../../Model/SwaggerDocs';
import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';
import { keycloak } from '../../Util/KeyCloakUtil';

class AppInfoService {

  constructor() {}

  static async getAppInfo(): Promise<AppInfo> {
    try {
      return fetch(config.path.appInfo, {
        headers: this.getDefaultHeaders()
      }).then(r => r.json());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async getSwaggerDocs(): Promise<SwaggerDocs> {
    try {
      return fetch(config.path.swagger, {
        headers: this.getDefaultHeaders()
      }).then(r => r.json());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie(),
      'Authorization': `Bearer ${keycloak.token}`
    };
  }


}
export default AppInfoService;
