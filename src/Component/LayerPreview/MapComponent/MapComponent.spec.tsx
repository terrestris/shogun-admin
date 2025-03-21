import React from 'react';

import {render,
  screen} from '@testing-library/react';
import OlMap from 'ol/Map';

import {
  MapComponent
} from './MapComponent';

describe('MapComponent', () => {

  it('renders the passed map', () => {
    const map = new OlMap();

    render(
      <MapComponent
        map={map}
      />
    );

    expect(screen.getByRole('presentation')).toBeVisible();
  });

});
