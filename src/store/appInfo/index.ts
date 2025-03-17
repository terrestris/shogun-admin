import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

export interface AppInfo {
  commitHash: string;
  version: string;
  buildTime: string;
  userId: number;
  authorities: string[];
}

const initialState: AppInfo = {
  commitHash: '',
  version: '',
  buildTime: '',
  userId: -1,
  authorities: []
};

const appInfoSlice = createSlice({
  name: 'appInfo',
  initialState,
  reducers: {
    setAppInfo(state, action: PayloadAction<AppInfo>) {
      return action.payload;
    }
  }
});

export const {
  setAppInfo
} = appInfoSlice.actions;

export default appInfoSlice.reducer;
