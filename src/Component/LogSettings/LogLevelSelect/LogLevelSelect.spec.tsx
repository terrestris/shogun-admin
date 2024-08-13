import React from 'react';

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';

import { LogLevelSelect } from './LogLevelSelect';

describe('<LogLevelSelect />', () => {
  const logLevels = ['OFF', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(LogLevelSelect).not.toBeUndefined();
  });

  it('can be rendered with default props', async () => {
    const {
      container
    } = render(
      <LogLevelSelect />
    );
    expect(container).toBeVisible();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display all log levels as options', async () => {
    render(
      <LogLevelSelect />
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    const options: NodeListOf<Element> = document.querySelectorAll('.ant-select-item-option-content');
    expect(options.length).toBe(logLevels.length);
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(logLevels[index]);
    });
  });

  it('should call onChange with the selected log level', async () => {
    const handleChange = jest.fn();
    render(<LogLevelSelect onChange={handleChange} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    await waitFor(() => {
      fireEvent.click(screen.getByText('INFO'));
    });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('INFO', {
        'children': 'INFO',
        'key': '4',
        'value': 'INFO'
      });
    });
  });
});
