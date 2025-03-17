import {
  Action,
  combineReducers,
  configureStore,
  createDynamicMiddleware,
  Reducer,
  ThunkDispatch
} from '@reduxjs/toolkit';

import appInfo from './appInfo';
import entityId from './entityId';
import infoModal from './infoModal';
import layerSuggestionList from './layerSuggestionList';
import openApiDocs from './openApiDocs';
import userInfo from './userInfo';

type AsyncReducer = Record<string, Reducer>;

export const dynamicMiddleware = createDynamicMiddleware();

export const createReducer = (asyncReducers?: AsyncReducer) => {
  return combineReducers({
    appInfo,
    userInfo,
    infoModal,
    openApiDocs,
    layerSuggestionList,
    entityId,
    ...asyncReducers
  });
};

export const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(dynamicMiddleware.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, undefined, Action>;
