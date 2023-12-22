import {
  atom
} from 'recoil';

import { AppInfo } from '@terrestris/shogun-util/dist/model/AppInfo';
import Layer from '@terrestris/shogun-util/dist/model/Layer';
import User from '@terrestris/shogun-util/dist/model/User';

export const appInfoAtom = atom<AppInfo>({
  key: 'appInfo',
  default: {
    commitHash: '',
    version: '',
    buildTime: '',
    userId: -1,
    authorities: []
  }
});

export const userInfoAtom = atom<User>({
  key: 'userInfo',
  default: {
    authProviderId: 'peter@pan.de'
  }
});

export const shogunInfoModalVisibleAtom = atom<boolean>({
  key: 'shogunInfoVisible',
  default: false
});

export const layerSuggestionListAtom = atom<Layer[]>({
  key: 'layerSuggestionList',
  default: undefined
});
