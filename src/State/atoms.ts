import {
  atom
} from 'recoil';
import { AppInfo } from '@terrestris/shogun-util/dist/model/AppInfo';
import User from '@terrestris/shogun-util/dist/model/User';
import Layer from '@terrestris/shogun-util/dist/model/Layer';

export const appInfoAtom = atom<AppInfo>({
  key: 'appInfo',
  default: {
    commitHash: undefined,
    version: undefined,
    buildTime: undefined,
    userId: undefined,
    authorities: undefined
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
  default: null
});
