import * as React from 'react';
import { shogunInfoModalVisibleAtom } from '../../../State/atoms';
import { render, screen } from '../../../test-util';

import ApplicationInfo from './ApplicationInfo';

const recoilInitializer = (snap) => snap.set(shogunInfoModalVisibleAtom, true);

describe('<ApplicationInfo />', () => {

  test('Modal has a title', async () => {
    render(<ApplicationInfo />, recoilInitializer);
    const modalTitle = await screen.getByText('SHOGun Admin info');
    expect(modalTitle).toBeDefined();
  });

  test('Modal contains Build-Info', async () => {
    render(<ApplicationInfo />, recoilInitializer);
    const buildInfo = await screen.getByText('Build Zeit');
    expect(buildInfo).toBeDefined();
  });

  test('Modal contains Version-Info', async () => {
    render(<ApplicationInfo />, recoilInitializer);
    const versionInfo = await screen.getByText('SHOGun Version');
    expect(versionInfo).toBeDefined();
  });

});
