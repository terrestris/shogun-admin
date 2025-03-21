import React from 'react';

import {
  fireEvent,
  render,
  screen
} from '@testing-library/react';

import { MarkdownEditor } from './MarkdownEditor';

describe('<MarkdownEditor />', () => {

  it('is defined', () => {
    expect(MarkdownEditor).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <MarkdownEditor />
    );
    expect(container).toBeVisible();

    const wrapperElement = container.querySelector('.fs-wrapper');
    expect(wrapperElement).toBeVisible();
  });

  it('input can be changed', async () => {
    const mockFunction = jest.fn((value) => { });

    render(
      <MarkdownEditor
        value='initial-test-value'
        onChange={mockFunction}
      />);

    const textboxElement = screen.getByRole('textbox');
    expect(textboxElement.innerHTML).toBe('initial-test-value');
    fireEvent.input(textboxElement);

    fireEvent.change(textboxElement, { target: { value: 'new-test-value' } });
    expect(textboxElement.innerHTML).toBe('new-test-value');
    expect(mockFunction).toHaveBeenCalled();
  });

  it('can be expanded to fullscreen', async () => {
    const {
      container
    } = render(
      <MarkdownEditor />
    );
    expect(container).toBeVisible();

    const fullscreenElement = screen.getByLabelText('fullscreen');
    fireEvent.click(fullscreenElement);
    expect(screen.getByLabelText('fullscreen-exit')).toBeVisible();
  });
});
