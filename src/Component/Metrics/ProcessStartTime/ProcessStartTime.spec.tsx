import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import moment from 'moment';

import { ProcessStartTime } from './ProcessStartTime';

jest.mock('../MetricEntry/MetricEntry', () => jest.fn(({ valueRenderer }) => (
  <div data-testid="metric-entry">
    {valueRenderer(1627840800)}
  </div>
)));

describe('<ProcessStartTime />', () => {

  it('is defined', () => {
    expect(ProcessStartTime).not.toBeUndefined();
  });

  it('can be rendered and formats the start time', () => {
    const {
      container
    } = render(
      <ProcessStartTime />
    );
    expect(container).toBeVisible();

    expect(screen.getByTestId('metric-entry')).toBeInTheDocument();

    const expectedDate = moment(1627840800 * 1000).format('llll');
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});
