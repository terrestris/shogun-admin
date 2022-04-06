import { CsrfUtil } from '@terrestris/base-util';

export default class SecurityUtil {

  public static getSecurityHeaders(config: any): any {
    const securityHeaders: any = {
      'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie(),
    };
    if (config?.security?.jwt === true) {
      securityHeaders.AUTHORIZATION = localStorage.getItem(config?.security?.authTokenKey);
    }
    return securityHeaders;
  }
}
