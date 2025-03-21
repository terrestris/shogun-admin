import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

const entityIdSlice = createSlice({
  name: 'entityId',
  initialState: null as number | null,
  reducers: {
    setEntityId(state, action: PayloadAction<number | null>) {
      return action.payload;
    }
  }
});

export const {
  setEntityId
} = entityIdSlice.actions;

export default entityIdSlice.reducer;
