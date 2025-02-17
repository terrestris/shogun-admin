import React from 'react';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { message } from 'antd';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import LogService from '../../../Service/LogService/LogService';

import { LogLevelTable } from './LogLevelTable';

jest.mock('../../../Hooks/useSHOGunAPIClient');
jest.mock('../../../Service/LogService/LogService');

const mockGetLoggers = jest.fn();
const mockSetLogger = jest.fn();
const mockMessageSuccess = jest.spyOn(message, 'success');

describe('<LogLevelTable />', () => {
  beforeEach(() => {
    (LogService as jest.Mock).mockImplementation(() => ({
      getLoggers: mockGetLoggers,
      setLogger: mockSetLogger
    }));
    (useSHOGunAPIClient as jest.Mock).mockReturnValue({
      getKeycloak: jest.fn()
    });

    const loggers = {
      'org.springframework': { effectiveLevel: 'INFO' },
      'com.example': { effectiveLevel: 'DEBUG' }
    };

    mockGetLoggers.mockResolvedValue(loggers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is defined', () => {
    expect(LogLevelTable).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <LogLevelTable />
    );
    expect(container).toBeVisible();
    expect(screen.getByRole('searchbox', { placeholder: /LogSettings.searchPlaceholder/i })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays table with data', async () => {
    render(<LogLevelTable />);

    await waitFor(() => {
      expect(screen.getByText('org.springframework')).toBeInTheDocument();
      expect(screen.getByText('com.example')).toBeInTheDocument();
    });
  });

  it('filters table data based on search input', async () => {
    render(<LogLevelTable />);

    await waitFor(() => {
      expect(screen.getByText('org.springframework')).toBeInTheDocument();
      expect(screen.getByText('com.example')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('LogSettings.searchPlaceholder'), {
      target: { value: 'com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.queryByText('org.springframework')).not.toBeInTheDocument();
      expect(screen.getByText('com.example')).toBeInTheDocument();
    });
  });

  it('calls onLoggerChange and show success message', async () => {
    mockGetLoggers.mockResolvedValue({
      'org.springframework': { effectiveLevel: 'INFO' }
    });
    mockSetLogger.mockResolvedValue(true);

    render(<LogLevelTable />);

    await waitFor(() => {
      expect(screen.getByText('org.springframework')).toBeInTheDocument();
    });

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    await waitFor(() => {
      fireEvent.click(screen.getByText('DEBUG'));
    });

    await waitFor(() => {
      expect(mockSetLogger).toHaveBeenCalledWith('org.springframework', 'DEBUG');
      expect(mockMessageSuccess).toHaveBeenCalledWith('Successfully set log level');
    });
  });
});

