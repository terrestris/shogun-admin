import {
  atom
} from 'recoil';
import User from '../Model/User';

export const userInfoAtom = atom<User>({
  key: 'userInfo',
  default: {
    username: 'Peter Pan',
    email: 'pan@terrestris.de'
  }
});
