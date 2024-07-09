import React from 'react';

import {
  render,
  screen
} from '@testing-library/react';

import { ShogunSpinner } from './ShogunSpinner';

describe('<ShogunSpinner />', () => {
  it('is defined', () => {
    expect(ShogunSpinner).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const {
      container
    } = render(<ShogunSpinner />);

    expect(container).toBeVisible();

    const imageElement = screen.getByAltText('shogun spinner');
    expect(imageElement).toBeVisible();
    expect(imageElement).toHaveAttribute('src', 'test-file-stub');
  });
});
