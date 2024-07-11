import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen
} from '@testing-library/react';

import i18n from '../../../i18n';

import { LinkField } from './LinkField';

let windowSpy;
describe('<LinkField />', () => {
  const originalPrompt = window.prompt;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'open').mockImplementation(undefined);
    window.prompt = jest.fn(() => 'mocked response');
  });

  afterEach(() => {
    cleanup();
    windowSpy.mockRestore();
    window.prompt = originalPrompt;
  });

  it('is defined', () => {
    expect(LinkField).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const mockLink = 'https://test.com';

    const {
      container
    } = render(
      <LinkField
        title='test-title'
        value={mockLink}
        i18n={i18n}
      />);
    expect(container).toBeVisible();
 
    const wrapperElement = container.querySelector('.link-wrapper');
    expect(wrapperElement).toBeVisible();

    const linkElement: HTMLElement | null = screen.getByLabelText('link');
    await fireEvent.mouseOver(linkElement);

    expect(
      await screen.findByText('test-title')
    ).toBeInTheDocument();
  });

  it('link can be opened', async () => {
    const mockLink = 'https://test.com';

    const {
      container
    } = render(
      <LinkField
        value={mockLink}
      />);
    expect(container).toBeVisible();

    const linkElement: HTMLElement | null = screen.getByLabelText('link');
    await fireEvent.click(linkElement);

    await expect(windowSpy).toHaveBeenCalled();
  });
});
