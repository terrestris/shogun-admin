import React from 'react';

import {
  render,
} from '@testing-library/react';

import DisplayField from './DisplayField';

describe('<DisplayField />', () => {

  it('is defined', () => {
    expect(DisplayField).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const mockFormatFunction = jest.fn((val?: any) => 'test');

    const {
      container
    } = render(
      <DisplayField
        formatFunction={mockFormatFunction}
      />);
    expect(container).toBeVisible();

    expect(container.querySelector('.displayfield')).toBeVisible();
    expect(container.innerHTML).toContain('test');

    expect(mockFormatFunction).toHaveBeenCalled();
  });

  it('can be rendered with date', async () => {
    const {
      container
    } = render(
      <DisplayField
        dateFormat='DD.MM.YYYY'
        format='date'
        value='01-01-2024'
      />);
    expect(container).toBeVisible();

    const fieldElement: HTMLElement | null = container.querySelector('.displayfield');
    expect(fieldElement).toBeVisible();
    expect(fieldElement?.innerHTML).toBe('01.01.2024');
  });

  it('can be rendered with array', async () => {
    const mockArray = ['test', 'text'];

    const {
      container
    } = render(
      <DisplayField
        value={mockArray}
      />);
    expect(container).toBeVisible();

    const fieldElement: HTMLElement | null = container.querySelector('.displayfield');
    expect(fieldElement).toBeVisible();
    expect(fieldElement?.innerHTML).toBe('test, text');
  });

  it('can be rendered with object', async () => {
    const mockObject = {
      'test-key': 'test-value'
    };

    const {
      container
    } = render(
      <DisplayField
        value={mockObject}
        valueKey='test-key'
      />);
    expect(container).toBeVisible();

    const fieldElement: HTMLElement | null = container.querySelector('.displayfield');
    expect(fieldElement).toBeVisible();
    expect(fieldElement?.innerHTML).toBe('test-value');
  });

  it('can be rendered with json', async () => {
    const mockJSON = [{
      'id': 0,
      'value': 'test-value0',
    }, {
      'id': 1,
      'value': 'test-value1',
    }]

    const {
      container
    } = render(
      <DisplayField
        value={mockJSON}
        format='json'
        suffix='test-suffix'
      />);
    expect(container).toBeVisible();

    const fieldElement: HTMLElement | null = container.querySelector('.displayfield');
    expect(fieldElement).toBeVisible();
    expect(fieldElement?.innerHTML).toContain('{\"id\":1,\"value\":\"test-value1\"}');
    expect(fieldElement?.innerHTML).toContain('test-suffix');
  });

  it('can be rendered with number', async () => {
    const {
      container
    } = render(
      <DisplayField
        value={3.14159}
        numberOfDigits={1}
      />);
    expect(container).toBeVisible();

    const fieldElement: HTMLElement | null = container.querySelector('.displayfield');
    expect(fieldElement).toBeVisible();
    expect(fieldElement?.innerHTML).toBe('3,1');
  });

});
