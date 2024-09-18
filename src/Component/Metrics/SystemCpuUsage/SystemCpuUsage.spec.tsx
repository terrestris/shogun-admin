import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import { SystemCpuUsage } from './SystemCpuUsage';

jest.mock('../MetricEntry/MetricEntry', () => jest.fn((props) => (
  <div data-testid="metric-entry" {...props} />
)));

describe('<SystemCpuUsage />', () => {

  it('is defined', () => {
    expect(SystemCpuUsage).not.toBeUndefined();
  });

  it('renders correctly and passes the correct type to MetricEntry', () => {
    render(<SystemCpuUsage />);

    const metricEntry = screen.getByTestId('metric-entry');
    expect(metricEntry).toBeInTheDocument();

    expect(metricEntry).toHaveAttribute('type', 'system.cpu.usage');
  });
});
