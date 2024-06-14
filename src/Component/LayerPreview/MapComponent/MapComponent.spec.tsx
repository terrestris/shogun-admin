import React from 'react';

import { describe, it, expect } from 'vitest';

import {
  render,
  screen
} from '@testing-library/react';

import OlMap from 'ol/Map';

import {
  MapComponent
} from './MapComponent';

describe('MapComponent', () => {

  it('renders an empty div if no map is available', () => {
    render(
      <MapComponent />
    );

    expect(screen.queryByRole('presentation')).toBeNull();
  });

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
