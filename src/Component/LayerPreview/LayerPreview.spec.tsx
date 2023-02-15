import React from 'react';

import {
  screen,
  render,
  fireEvent
} from '@testing-library/react';

import {
  LayerPreview
} from './LayerPreview';
import Layer from '@terrestris/shogun-util/dist/model/Layer';

describe('LayerPreview', () => {

  it('opens the modal containing the map (and the preview layer) on button click', () => {
    const layer: Layer = {
      name: 'Test',
      type: 'WMS',
      sourceConfig: {
        url: 'http://localhost/ows',
        layerNames: 'Test'
      }
    };

    render(
      <LayerPreview
        layer={layer}
      />
    );

    expect(screen.queryByRole('img')).toBeVisible();

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.queryByRole('img'));

    expect(screen.queryByRole('dialog')).toBeVisible();

    expect(screen.queryByRole('presentation')).toBeVisible();
  });

});
