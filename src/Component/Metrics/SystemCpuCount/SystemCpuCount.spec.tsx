import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import { SystemCpuCount } from './SystemCpuCount';

jest.mock('../MetricEntry/MetricEntry', () => jest.fn((props) => (
  <div data-testid="metric-entry" {...props} />
)));

describe('<SystemCpuCount />', () => {

  it('is defined', () => {
    expect(SystemCpuCount).not.toBeUndefined();
  });

  it('can be rendered and passes the correct type to MetricEntry', () => {
    render(<SystemCpuCount />);

    const metricEntry = screen.getByTestId('metric-entry');
    expect(metricEntry).toBeInTheDocument();

    expect(metricEntry).toHaveAttribute('type', 'system.cpu.count');
  });
});
