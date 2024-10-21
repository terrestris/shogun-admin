import React from 'react';

import { render } from '@testing-library/react';

import ShogunSpinner from '../ShogunSpinner/ShogunSpinner';

describe('<ShogunSpinner />', () => {

  it('can be rendered', async () => {
    const {
      container
    } = render(<ShogunSpinner />);
    expect(container).toBeVisible();
  });
});
