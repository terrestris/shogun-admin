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
  public static getInitials(userName: string): string {
    const splittedName = (userName as string).split(' ');
    const initals = [];
    splittedName.forEach((part) => {
      if (part[0]) {
        initals.push(part[0].toUpperCase());
      }
    });
    return initals.join('');
  }
}
