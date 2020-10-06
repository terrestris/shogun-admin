import * as React from 'react';
import { render, fireEvent, screen } from '../../../test-util';

import ApplicationInfo from './ApplicationInfo';

describe('<ApplicationInfo />', () => {
  test('has an opener', async () => {
    render(<ApplicationInfo appInfo={{}} />);

    const button = screen.getByText('Open');
    expect(button).toBeTruthy();
  });

  test('Opener shows modal if clicked', async () => {
    render(<ApplicationInfo appInfo={{}} />);
    const button = screen.getByText('Open');
    await fireEvent.click(button);
    const modalTitle = await screen.getByText('Application Info');
    expect(modalTitle).toBeDefined();
  });

  test('Modal contains Build-Info', async () => {
    render(<ApplicationInfo appInfo={{}} />);
    const button = screen.getByText('Open');
    await fireEvent.click(button);
    const buildInfo = await screen.getByText('Build');

    expect(buildInfo).toBeDefined();
  });

  test('Modal contains Version-Info', async () => {
    render(<ApplicationInfo appInfo={{}} />);
    const button = screen.getByText('Open');
    await fireEvent.click(button);
    const versionInfo = await screen.getByText('Version');

    expect(versionInfo).toBeDefined();
  });

});
