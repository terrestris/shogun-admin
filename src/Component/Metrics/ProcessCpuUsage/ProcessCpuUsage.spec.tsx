import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import { ProcessCpuUsage } from './ProcessCpuUsage';

jest.mock('../MetricEntry/MetricEntry', () => jest.fn((props) => (
  <div data-testid="metric-entry" {...props} />
)));

describe('<ProcessCpuUsage />', () => {

  it('is defined', () => {
    expect(ProcessCpuUsage).not.toBeUndefined();
  });

  it('can be rendered and passes the correct type to MetricEntry', () => {
    render(<ProcessCpuUsage />);

    const metricEntry = screen.getByTestId('metric-entry');
    expect(metricEntry).toBeInTheDocument();

    expect(metricEntry).toHaveAttribute('type', 'process.cpu.usage');
  });
});
