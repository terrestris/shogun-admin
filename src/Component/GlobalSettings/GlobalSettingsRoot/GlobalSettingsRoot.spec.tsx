import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';

import GlobalSettingsRoot from './GlobalSettingsRoot';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

describe('<GlobalSettingsRoot />', () => {

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(GlobalSettingsRoot).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <GlobalSettingsRoot />);
    expect(container).toBeVisible();
    expect(container.querySelector('.global-settings-root')).toBeVisible();
    expect(container.querySelector('.header')).toBeVisible();
    expect(container.querySelector('.global-settings-container')).toBeVisible();
  });

  it('navigates back on click', async () => {
    const {
      container
    } = render(
      <GlobalSettingsRoot />);
    expect(container).toBeVisible();
    const arrowElement: HTMLElement | null = container.querySelector('span[aria-label="arrow-left"]');
    await fireEvent.click(arrowElement!);

    expect(mockUsedNavigate).toHaveBeenCalled();
  });
});

