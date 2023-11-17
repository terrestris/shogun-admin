import User from '@terrestris/shogun-util/dist/model/User';
import { md5 } from 'js-md5';
import _isNil from 'lodash/isNil';

export interface GravatarProps {
  email: string;
  size?: number;
  rating?: 'g' | 'pg' | 'r' | 'x';
  defaultImage?: '404' | 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'blank';
  force?: boolean;
}

const GRAVATAR_BASE_URL = 'https://www.gravatar.com/avatar/';

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
    const firstNameLetter = user?.providerDetails?.firstName?.charAt(0);
    const lastNameLetter = user?.providerDetails?.lastName?.charAt(0);
    if (_isNil(firstNameLetter) || _isNil(lastNameLetter)) {
      return '🔧';
    }
    return firstNameLetter.toUpperCase() + lastNameLetter.toUpperCase();
  }

  public static getGravatarUrl({
    email = '',
    size = 80,
    rating = 'g',
    defaultImage = 'identicon',
    force = false
  }: GravatarProps): string {
    const lowerCaseEmail = email.toLowerCase();
    const hash = md5(lowerCaseEmail);

    let url = `${GRAVATAR_BASE_URL}${hash}?s=${size}&r=${rating}&d=${defaultImage}`;

    if (force) {
      url = `${url}&f=y`;
    }

    return url;
  }

}
