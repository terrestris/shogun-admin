import React from 'react';

import {
  createReduxWrapper
} from '../../../test-util';

import ApplicationInfo from './ApplicationInfo';

import {
  act,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { setVisible } from '../../../store/infoModal';
import { store } from '../../../store/store';

const PROJECT_VERSION = '1.0.0';

jest.mock('../../../Hooks/useClientVersion', () => ({
  useClientVersion: () => PROJECT_VERSION
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  })
}));

describe('<ApplicationInfo />', () => {

  test('Modal has a title', async () => {
    render(<ApplicationInfo />, {
      wrapper: createReduxWrapper()
    });

    act(() => {
      store.dispatch(setVisible(true));
    });

    await waitFor(() => {
      const modalTitle = screen.getByText('ApplicationInfoModal.clientAbout');
      expect(modalTitle).toBeDefined();
    });
  });

  test('Modal contains Build-Info', async () => {
    render(<ApplicationInfo />, {
      wrapper: createReduxWrapper()
    });

    act(() => {
      store.dispatch(setVisible(true));
    });

    await waitFor(() => {
      const buildInfo = screen.getByText('ApplicationInfoModal.backendVersion');
      expect(buildInfo).toBeDefined();
    });
  });

  test('Modal contains Version-Info', async () => {
    render(<ApplicationInfo />, {
      wrapper: createReduxWrapper()
    });

    act(() => {
      store.dispatch(setVisible(true));
    });

    await waitFor(() => {
      const versionInfo = screen.getByText('ApplicationInfoModal.backendVersion');
      expect(versionInfo).toBeDefined();
    });
  });

  test('Modal contains Admin-Client-Version-Info', async () => {
    render(<ApplicationInfo />, {
      wrapper: createReduxWrapper()
    });

    act(() => {
      store.dispatch(setVisible(true));
    });

    await waitFor(() => {
      const adminClientVersionInfo = screen.getByText('ApplicationInfoModal.clientVersion');
    expect(adminClientVersionInfo).toBeDefined();
    });
  });

});
