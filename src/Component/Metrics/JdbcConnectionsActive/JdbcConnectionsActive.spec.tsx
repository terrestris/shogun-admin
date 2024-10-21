import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import MetricEntry from '../MetricEntry/MetricEntry';

import { JdbcConnectionsActive } from './JdbcConnectionsActive';

jest.mock('../MetricEntry/MetricEntry', () => {
  return ({ type, ...props }: any) => (
    <div data-testid="metric-entry" data-type={type} {...props} />
  );
});

describe('<JdbcConnectionsActive />', () => {

  it('is defined', () => {
    expect(JdbcConnectionsActive).not.toBeUndefined();
  });

  it('should render MetricEntry with correct type and pass-through props', () => {
    const passThroughProps = {
      testProp: 'testValue',
      anotherProp: 42
    };

    render(<JdbcConnectionsActive {...passThroughProps} />);

    const metricEntry = screen.getByTestId('metric-entry');
    expect(metricEntry).toBeInTheDocument();
    expect(metricEntry).toHaveAttribute('data-type', 'jdbc.connections.active');

    expect(metricEntry).toHaveAttribute('testProp', 'testValue');
    expect(metricEntry).toHaveAttribute('anotherProp', '42');
  });
});

