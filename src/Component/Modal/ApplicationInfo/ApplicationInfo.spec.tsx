import * as React from 'react';
import { shogunInfoModalVisibleAtom } from '../../../State/atoms';
import { render, screen } from '../../../test-util';

import ApplicationInfo from './ApplicationInfo';

const recoilInitializer = (snap) => snap.set(shogunInfoModalVisibleAtom, true);

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
    render(<ApplicationInfo />, recoilInitializer);
    const modalTitle = await screen.getByText('ApplicationInfoModal.clientAbout');
    expect(modalTitle).toBeDefined();
  });

  test('Modal contains Build-Info', async () => {
    render(<ApplicationInfo />, recoilInitializer);
    const buildInfo = await screen.getByText('ApplicationInfoModal.backendVersion');
    expect(buildInfo).toBeDefined();
  });

  test('Modal contains Version-Info', async () => {
    render(<ApplicationInfo />, recoilInitializer);
    const versionInfo = await screen.getByText('ApplicationInfoModal.backendVersion');
    expect(versionInfo).toBeDefined();
  });

  test('Modal contains Admin-Client-Version-Info', async () => {
    render(<ApplicationInfo />, recoilInitializer);
    const adminClientVersionInfo = await screen.getByText('ApplicationInfoModal.clientVersion');
    expect(adminClientVersionInfo).toBeDefined();
  });

});
