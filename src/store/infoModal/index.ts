import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

const shogunInfoModalVisibleSlice = createSlice({
  name: 'shogunInfoVisible',
  initialState: false,
  reducers: {
    setVisible(state, action: PayloadAction<boolean>) {
      return action.payload;
    }
  }
});

export const {
  setVisible
} = shogunInfoModalVisibleSlice.actions;

export default shogunInfoModalVisibleSlice.reducer;
