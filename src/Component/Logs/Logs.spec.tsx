import React from 'react';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';
import LogService from '../../Service/LogService/LogService';

import { Logs } from './Logs';

jest.mock('../../Hooks/useSHOGunAPIClient');
jest.mock('../../Service/LogService/LogService');

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('<Logs />', () => {
  let mockGetLogs: any;
  let mockSetInterval: any;
  let mockClearInterval: any;

  beforeEach(() => {
    mockGetLogs = jest.fn();
    (LogService as jest.Mock).mockImplementation(() => ({
      getLogs: mockGetLogs
    }));
    (useSHOGunAPIClient as jest.Mock).mockReturnValue({
      getKeycloak: jest.fn()
    });

    mockSetInterval = jest.fn();
    mockClearInterval = jest.fn();
  });


  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('is defined', () => {
    expect(Logs).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(<Logs />);
    expect(container).toBeVisible();
    expect(screen.getByText('Logs.logs')).toBeInTheDocument();
  });

  it('should fetch logs on load', async () => {
    mockGetLogs.mockResolvedValue('Test log content');

    render(<Logs />);

    await waitFor(() => {
      expect(screen.getByText('Test log content')).toBeInTheDocument();
    });
  });

  it('should display an error message when log fetching fails', async () => {
    mockGetLogs.mockResolvedValue(null);

    render(<Logs />);

    await waitFor(() => {
      expect(screen.getByText('Logs.warningMessage')).toBeInTheDocument();
    });
  });

  it('should handle auto-reload switch correctly', () => {
    jest.useFakeTimers();
    global.setInterval = mockSetInterval;
    global.clearInterval = mockClearInterval;

    render(<Logs />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect((setInterval)).toHaveBeenCalledWith(expect.any(Function), 1000);

    fireEvent.click(switchElement);
    expect(clearInterval).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should manually fetch logs when the refresh button is clicked', async () => {
    mockGetLogs.mockResolvedValue('Updated log content');
    global.setInterval = mockSetInterval;
    global.clearInterval = mockClearInterval;

    render(<Logs />);

    const refreshButton = screen.getByText('Logs.refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('Updated log content')).toBeInTheDocument();
    });
  });
});

