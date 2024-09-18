import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import moment from 'moment';

import { ProcessUptime } from './ProcessUptime';

jest.mock('../MetricEntry/MetricEntry', () => jest.fn(({ valueRenderer, suffixRenderer }) => (
  <div data-testid="metric-entry">
    {valueRenderer(3600)}
    {suffixRenderer()}
  </div>
)));

describe('<ProcessUptime />', () => {

  it('is defined', () => {
    expect(ProcessUptime).not.toBeUndefined();
  });

  it('can be rendered and formats the uptime', () => {
    const {
      container
    } = render(
      <ProcessUptime />
    );
    expect(container).toBeVisible();

    expect(screen.getByTestId('metric-entry')).toBeInTheDocument();

    const expectedTime = moment.utc(3600 * 1000).format('HH:mm:ss');
    expect(screen.getByText(expectedTime)).toBeInTheDocument();

    expect(screen.getByText('HH:mm:ss')).toBeInTheDocument();
  });
});
