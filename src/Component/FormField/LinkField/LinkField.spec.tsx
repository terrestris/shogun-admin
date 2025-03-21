import React from 'react';

import {
  cleanup,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import { LinkField } from './LinkField';

import userEvent from '@testing-library/user-event';

jest.mock('../../../Util/TranslationUtil', () => ({
  getTranslationFromConfig: jest.fn((title) => title)
}));

let windowSpy: any;
describe('<LinkField />', () => {

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'open').mockImplementation(undefined);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    windowSpy.mockRestore();
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
      />
    );
    expect(container).toBeVisible();

    const wrapperElement = container.querySelector('.link-wrapper');
    expect(wrapperElement).toBeVisible();

    const linkElement = screen.getByLabelText('link');
    expect(linkElement).toBeVisible();

    await userEvent.hover(linkElement);

    await waitFor(() => {
      const tooltip = screen.getByText('test-title');

      expect(tooltip).toBeInTheDocument();
    });
  });

  it('link can be opened', async () => {
    const mockLink = 'https://test.com';

    const {
      container
    } = render(
      <LinkField
        value={mockLink}
      />
    );
    expect(container).toBeVisible();

    const linkElement: HTMLElement | null = screen.getByLabelText('link');
    await userEvent.click(linkElement);

    expect(windowSpy).toHaveBeenCalled();
  });
});
