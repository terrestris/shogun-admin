import React from 'react';

import {
  act,
  cleanup,
  render
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { CopyToClipboardButton } from './CopyToClipboardButton';

describe('<CopyToClipboardButton />', () => {

  afterEach(cleanup);

  it('can be rendered', () => {
    const {
      container
    } = render(
      <CopyToClipboardButton />
    );

    expect(container).toBeVisible();
  });

  it('copies the given string value to the clipboard', async () => {
    userEvent.setup();

    const {
      getByRole
    } = render(
      <CopyToClipboardButton
        value="Copy me!"
      />
    );

    const button = getByRole('button');

    await userEvent.click(button);

    const text = await navigator.clipboard.readText();

    expect(text).toBe('Copy me!');
  });

  it('shows a success indicator', async () => {
    userEvent.setup();

    const {
      getByRole,
      container
    } = render(
      <CopyToClipboardButton
        value="Copy me!"
        feedbackDuration={500}
      />
    );

    const button = getByRole('button');

    await userEvent.click(button);

    let checkmark = container.querySelector('div.checkmark');

    expect(checkmark).toBeVisible();

    await act(async () => {
      await new Promise(res => setTimeout(res, 600));
    });

    checkmark = container.querySelector('div.checkmark');

    expect(checkmark).toBeNull();
  });
});
