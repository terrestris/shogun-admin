import React from 'react';

import {
  fireEvent,
  render,
  screen
} from '@testing-library/react';

import Layer from '@terrestris/shogun-util/dist/model/Layer';

import {
  LayerPreview
} from './LayerPreview';

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
        transitionName=""
      />
    );

    const element = screen.queryByRole('img');

    expect(element).toBeVisible();

    if (!element) {
      return;
    }

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(element);

    expect(screen.queryByRole('dialog')).toBeVisible();

    expect(screen.queryByRole('presentation')).toBeVisible();
  });

});
