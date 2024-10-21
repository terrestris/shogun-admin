import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import MetricEntry from '../MetricEntry/MetricEntry';

import { JvmThreadsLive } from './JvmThreadsLive';

jest.mock('../MetricEntry/MetricEntry', () => {
  return ({
    type,
    ...props
  }: any) => (
    <div
      data-testid="metric-entry"
      data-type={type}
      {...props}
    />
  );
});

describe('<JvmThreadsLive />', () => {

  it('is defined', () => {
    expect(JvmThreadsLive).not.toBeUndefined();
  });

  it('can render MetricEntry with correct type and pass-through props', () => {
    const passThroughProps = {
      testProp: 'testValue',
      anotherProp: 42
    };

    render(<JvmThreadsLive {...passThroughProps} />);

    const metricEntry = screen.getByTestId('metric-entry');
    expect(metricEntry).toBeInTheDocument();
    expect(metricEntry).toHaveAttribute('data-type', 'jvm.threads.live');

    expect(metricEntry).toHaveAttribute('testProp', 'testValue');
    expect(metricEntry).toHaveAttribute('anotherProp', '42');
  });
});
