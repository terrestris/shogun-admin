import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import {
  OpenAPIV3
} from 'openapi-types';

const openApiDocs = createSlice({
  name: 'swaggerDocs',
  initialState: {} as OpenAPIV3.Document,
  reducers: {
    setOpenApiDocs(state, action: PayloadAction<OpenAPIV3.Document>) {
      return action.payload;
    }
  }
});

export const {
  setOpenApiDocs
} = openApiDocs.actions;

export default openApiDocs.reducer;
