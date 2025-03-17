import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import User, {
  ProviderUserDetails
} from '@terrestris/shogun-util/dist/model/User';

const initialState: User<ProviderUserDetails> = {
  authProviderId: 'peter@pan.de'
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<User<ProviderUserDetails>>) {
      return action.payload;
    }
  }
});

export const {
  setUserInfo
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
