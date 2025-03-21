import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import Layer from '@terrestris/shogun-util/dist/model/Layer';

const layerSuggestionListSlice = createSlice({
  name: 'layerSuggestionList',
  initialState: [] as Layer[],
  reducers: {
    setLayerSuggestionList(state, action: PayloadAction<Layer[]>) {
      return action.payload;
    }
  }
});

export const {
  setLayerSuggestionList
} = layerSuggestionListSlice.actions;

export default layerSuggestionListSlice.reducer;
