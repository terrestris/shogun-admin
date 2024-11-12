import React from 'react';

import {
  cleanup,
  render
} from '@testing-library/react';

import { UploadLayerButton } from './UploadLayerButton';

describe('<UploadLayerButton />', () => {

  afterEach(cleanup);

  it('can be rendered', () => {
    const {
      container
    } = render(
      <UploadLayerButton />);

    expect(container).toBeVisible();
  });
});
