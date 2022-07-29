import lng from "../i18n/index";
import { FormTranslations } from "../Component/GeneralEntity/GeneralEntityRoot/GeneralEntityRoot";

export default class TranslationUtil {

  public static getTranslationFromConfig = (key: string, i18n: FormTranslations) => {
    let language = lng.language;
    const substring = '#i18n.';

    if (key && key.startsWith(substring)) {
      if (i18n[language]) {
        key = key.split(substring)[1];
        return i18n[language][key];
      } else {
        return key;
      }
    } else {
      return key;
    }
  }
}
