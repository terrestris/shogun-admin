import * as React from 'react';
import { render, fireEvent, screen } from '../../../test-util';

import ApplicationInfo from './ApplicationInfo';

describe('<ApplicationInfo />', () => {
  test('has an opener', async () => {
    render(<ApplicationInfo />);

    const button = screen.getByText('Open');
    expect(button).toBeTruthy();
  });

  test('Opener shows modal if clicked', async () => {
    render(<ApplicationInfo />);
    const button = screen.getByText('Open');
    await fireEvent.click(button);
    const modalTitle = await screen.getByText('SHOGun Admin info');
    expect(modalTitle).toBeDefined();
  });

  test('Modal contains Build-Info', async () => {
    render(<ApplicationInfo />);
    const button = screen.getByText('Open');
    await fireEvent.click(button);
    const buildInfo = await screen.getByText('Build Zeit');

    expect(buildInfo).toBeDefined();
  });

  test('Modal contains Version-Info', async () => {
    render(<ApplicationInfo />);
    const button = screen.getByText('Open');
    await fireEvent.click(button);
    const versionInfo = await screen.getByText('SHOGun Version');

    expect(versionInfo).toBeDefined();
  });

});
