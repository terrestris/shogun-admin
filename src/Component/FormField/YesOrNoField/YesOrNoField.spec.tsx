import React from 'react';

import {
  cleanup,
  render,
  screen
} from '@testing-library/react';

import YesOrNoField from './YesOrNoField';

describe('<YesOrNoField />', () => {

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(YesOrNoField).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <YesOrNoField
        value={true}
      />);
    expect(container).toBeVisible();

    expect(container.querySelector('.yes-no-field')).toBeVisible();
    expect(container.querySelector('.yn-text')).toBeVisible();
  });

  it('shows correct value', async () => {
    const { rerender } = render(
      <YesOrNoField
        value={true}
      />);

    expect(screen.getByText('YesorNoField.yes')).toBeVisible();
    expect(screen.getByRole('img')).toHaveClass('anticon-check');

    await rerender(
      <YesOrNoField
        value={false}
      />);

    expect(screen.getByText('YesorNoField.no')).toBeVisible();
    expect(screen.getByRole('img')).toHaveClass('anticon-close');
  });
});

