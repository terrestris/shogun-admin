import _isNil from 'lodash/isNil';

import lng from '../i18n/index';

export default class TranslationUtil {

  public static getTranslationFromConfig = (key?: string, i18n?: FormTranslations) => {
    const language = lng.language;
    const substring = '#i18n.';

    if (_isNil(i18n) || _isNil(key)) {
      return {};
    }

    if (key && key.startsWith(substring)) {
      if ((i18n as any)[language]) {
        key = key.split(substring)[1];
        return (i18n as any)[language][key];
      } else {
        return key;
      }
    } else {
      return key;
    }
  };
}
