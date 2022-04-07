import {
  atom
} from 'recoil';
import { AppInfo } from '../Model/AppInfo';
import User from '../Model/User';

export const appInfoAtom = atom<AppInfo>({
  key: 'appInfo',
  default: {
    version: undefined,
    buildTime: undefined,
    userId: undefined,
    authorities: undefined
  }
});

export const userInfoAtom = atom<User>({
  key: 'userInfo',
  default: {
    providerDetails: {
      username: 'Peter Pan',
      email: 'pan@terrestris.de'
    }
  }
});

export const userProfileModalVisibleAtom = atom<boolean>({
  key: 'userProfileVisible',
  default: false
});

export const shogunInfoModalVisibleAtom = atom<boolean>({
  key: 'shogunInfoVisible',
  default: false
});
