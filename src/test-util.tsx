import React from 'react';

import {
  Provider
} from 'react-redux';

import {
  store
} from './store/store';

// A type to make all properties - except of the specified ones - of
// an input object optional.
// Example: PartialOmit<SHOGunAPIClient, 'group'>
export type PartialOmit<T, K extends keyof T> = Pick<T, K> & Omit<Partial<T>, K>;

export const createReduxWrapper = () => {
  return ({
    children
  }: any) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
};
