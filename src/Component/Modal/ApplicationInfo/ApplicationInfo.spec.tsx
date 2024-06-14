import React from 'react';

import { describe, expect, test, vi } from 'vitest';

import { shogunInfoModalVisibleAtom } from '../../../State/atoms';
import { render, screen } from '../../../test-util';

import ApplicationInfo from './ApplicationInfo';

const recoilInitializer = (snap: any) => snap.set(shogunInfoModalVisibleAtom, true);

const PROJECT_VERSION = '1.0.0';

vi.mock('../../../Hooks/useClientVersion', () => ({
  useClientVersion: () => PROJECT_VERSION
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() }
  })
}));

describe('<ApplicationInfo />', () => {

  test('Modal has a title', () => {
    render(<ApplicationInfo />, recoilInitializer);
    const modalTitle = screen.getByText('ApplicationInfoModal.clientAbout');
    expect(modalTitle).toBeDefined();
  });

  test('Modal contains Build-Info', () => {
    render(<ApplicationInfo />, recoilInitializer);
    const buildInfo = screen.getByText('ApplicationInfoModal.backendVersion');
    expect(buildInfo).toBeDefined();
  });

  test('Modal contains Version-Info', () => {
    render(<ApplicationInfo />, recoilInitializer);
    const versionInfo = screen.getByText('ApplicationInfoModal.backendVersion');
    expect(versionInfo).toBeDefined();
  });

  test('Modal contains Admin-Client-Version-Info', () => {
    render(<ApplicationInfo />, recoilInitializer);
    const adminClientVersionInfo = screen.getByText('ApplicationInfoModal.clientVersion');
    expect(adminClientVersionInfo).toBeDefined();
  });

});
