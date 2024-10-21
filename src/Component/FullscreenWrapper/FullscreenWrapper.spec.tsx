import React from 'react';

import {
  cleanup,
  fireEvent,
  getByRole,
  render,
  screen
} from '@testing-library/react';

import { FullscreenWrapper } from './FullscreenWrapper';

describe('<FullscreenWrapper />', () => {

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(FullscreenWrapper).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <FullscreenWrapper />);
    expect(container).toBeVisible();

    expect(container.querySelector('.fs-wrapper')).toBeVisible();
  });

  it('can toggle fullscreen', async () => {
    render(
      <FullscreenWrapper />
    );

    await fireEvent.click(screen.getByRole('img'));

    expect(document.querySelector('.fullscreen')).toBeVisible();

    const exitElement: HTMLElement | null = document.querySelector('span[aria-label="fullscreen-exit"]');
    expect(exitElement).toBeVisible();

    await fireEvent.click(exitElement!);

    expect(exitElement).not.toBeVisible();
  });

  it('can exit fullscreen by pressing esc', async () => {
    const {
      container
    } = render(
      <FullscreenWrapper />
    );

    await fireEvent.click(screen.getByRole('img'));

    expect(container.querySelector('.fullscreen')).toBeVisible();

    await fireEvent.keyDown(getByRole(container, 'img'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });

    expect(container.querySelector('span[aria-label="fullscreen"]')).toBeVisible();
  });
});
