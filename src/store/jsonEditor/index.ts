import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

export interface JsonEditorState {
  originalEditorValues?: Record<string, string>;
  isEditedManuallyMap?: Record<string, boolean>;
}

const initialState: JsonEditorState = {
  originalEditorValues: undefined,
  isEditedManuallyMap: undefined
};

const jsonEditorSlice = createSlice({
  name: 'jsonEditor',
  initialState,
  reducers: {
    setOriginalEditorValues(state, action: PayloadAction<Record<string, string>>) {
      state.originalEditorValues = action.payload;
    },
    setIsEditedManuallyMap(state, action: PayloadAction<Record<string, boolean>>) {
      state.isEditedManuallyMap = action.payload;
    }
  }
});

export const {
  setOriginalEditorValues,
  setIsEditedManuallyMap
} = jsonEditorSlice.actions;

export default jsonEditorSlice.reducer;
