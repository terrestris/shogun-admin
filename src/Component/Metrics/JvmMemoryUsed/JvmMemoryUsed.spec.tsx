import React from 'react';

import {
  render,
  screen,
} from '@testing-library/react';

import { JvmMemoryUsed } from './JvmMemoryUsed';

jest.mock('../MetricEntry/MetricEntry', () => {
  return ({
    type,
    valueRenderer,
    suffixRenderer,
    ...props
  }: any) => (
    <div
      data-testid="metric-entry"
      data-type={type}
      data-value-renderer={valueRenderer ? valueRenderer(100).props.children : undefined}
      data-suffix-renderer={suffixRenderer ? suffixRenderer().props.children : undefined}
      {...props}
    />
  );
});

describe('<JvmMemoryUsed />', () => {

  it('is defined', () => {
    expect(JvmMemoryUsed).not.toBeUndefined();
  });

  it('can render MetricEntry with correct type, valueRenderer, and suffixRenderer', () => {
    const passThroughProps = {
      testProp: 'testValue',
      anotherProp: 42
    };

    render(<JvmMemoryUsed {...passThroughProps} />);

    const metricEntry = screen.getByTestId('metric-entry');
    expect(metricEntry).toBeInTheDocument();
    expect(metricEntry).toHaveAttribute('data-type', 'jvm.memory.used');

    const valueRendererOutput = metricEntry.getAttribute('data-value-renderer');
    expect(valueRendererOutput).toBe('0.00');


    const suffixRendererOutput = metricEntry.getAttribute('data-suffix-renderer');
    expect(suffixRendererOutput).toBe('MB');

    expect(metricEntry).toHaveAttribute('testProp', 'testValue');
    expect(metricEntry).toHaveAttribute('anotherProp', '42');
  });
});

