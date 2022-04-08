import User from '../Model/User';

export default class UserUtil {

  /**
   * Determine initials for a given user name. The username will be splitted by
   * a whitespace and the first character of each part (capital letter) is added
   * to the initials.
   * e.g. 'John Doe' leads to 'JD'
   *
   * @return Initials if the user name.
   *
   * @method getInitials
   */
  public static getInitials(user: User): string {
    // TODO: get the intials form a username config
    return '🔧';
  }
}
