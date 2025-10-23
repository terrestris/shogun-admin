import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

const initialState: Record<string, string> = {};

const originalConfigValueSlice = createSlice({
  name: 'originalConfigValues',
  initialState: initialState,
  reducers: {
    setOriginalConfigValues(state, action: PayloadAction<Record<string, string>>) {
      return action.payload;
    }
  }
});

export const {
  setOriginalConfigValues
} = originalConfigValueSlice.actions;

export default originalConfigValueSlice.reducer;
