import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import { SystemLoadAverage } from './SystemLoadAverage';

jest.mock('../MetricEntry/MetricEntry', () => jest.fn((props) => (
  <div data-testid="metric-entry" {...props} />
)));
describe('<SystemLoadAverage />', () => {

  it('is defined', () => {
    expect(SystemLoadAverage).not.toBeUndefined();
  });

  it('renders correctly and passes the correct type to MetricEntry', () => {
    render(<SystemLoadAverage />);

    const metricEntry = screen.getByTestId('metric-entry');
    expect(metricEntry).toBeInTheDocument();

    expect(metricEntry).toHaveAttribute('type', 'system.load.average.1m');
  });

});
