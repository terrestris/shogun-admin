import React from 'react';

import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react';

import LayerType from '@terrestris/shogun-util/dist/model/enum/LayerType';

import { LayerTypeSelect } from './LayerTypeSelect';

describe('<LayerTypeSelect />', () => {
  let typeValue: LayerType;

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(LayerTypeSelect).not.toBeUndefined();
  });

  it('can be rendered with default props', async () => {
    const {
      container
    } = render(
      <LayerTypeSelect />
    );
    expect(container).toBeVisible();

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('correctly sets the initial value and updates when prop changes', async () => {
    typeValue = 'WFS';

    const { rerender } = render(
      <LayerTypeSelect
        value={typeValue}
      />
    );

    expect(screen.getByTitle('WFS')).toBeVisible();

    const selectElement = screen.getByRole('combobox');

    fireEvent.mouseDown(selectElement);
    await waitFor(() => {
      expect(screen.getByText('WMS')).toBeInTheDocument();
    });

    rerender(<LayerTypeSelect value='WMTS' />);
    document.querySelector('.ant-select-selection-item');
    expect(document.querySelector('.ant-select-selection-item')?.innerHTML).toBe('WMTS');
  });

  it('calls onChange handler with the correct value', async () => {
    const handleChange = jest.fn();
    render(
      <LayerTypeSelect
        value={'WMS'}
        onChange={handleChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    await waitFor(() => {
      fireEvent.click(screen.getByText('WMTS'));
    });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('WMTS');
    });


  });


});
