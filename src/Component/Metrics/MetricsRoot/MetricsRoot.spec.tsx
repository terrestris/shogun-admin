import React from 'react';

import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { MetricsRoot } from './MetricsRoot';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../JdbcConnectionsActive/JdbcConnectionsActive', () => () => <div>JdbcConnectionsActive Component</div>);
jest.mock('../JvmMemoryUsed/JvmMemoryUsed', () => () => <div>JvmMemoryUsed Component</div>);
jest.mock('../JvmThreadsLive/JvmThreadsLive', () => () => <div>JvmThreadsLive Component</div>);
jest.mock('../ProcessCpuUsage/ProcessCpuUsage', () => () => <div>ProcessCpuUsage Component</div>);
jest.mock('../ProcessStartTime/ProcessStartTime', () => () => <div>ProcessStartTime Component</div>);
jest.mock('../ProcessUptime/ProcessUptime', () => () => <div>ProcessUptime Component</div>);
jest.mock('../SystemCpuCount/SystemCpuCount', () => () => <div>SystemCpuCount Component</div>);
jest.mock('../SystemCpuUsage/SystemCpuUsage', () => () => <div>SystemCpuUsage Component</div>);
jest.mock('../SystemLoadAverage/SystemLoadAverage', () => () => <div>SystemLoadAverage Component</div>);

describe('<MetricsRoot />', () => {

  it('is defined', () => {
    expect(MetricsRoot).not.toBeUndefined();
  });

  it('can be rendered with all metric components', () => {
    const {
      container
    } = render(<MetricsRoot />);
    expect(container).toBeVisible();

    expect(screen.getByText('Metrics.title')).toBeInTheDocument();
    expect(screen.getByText('Metrics.info')).toBeInTheDocument();

    expect(screen.getByText('JdbcConnectionsActive Component')).toBeInTheDocument();
    expect(screen.getByText('JvmThreadsLive Component')).toBeInTheDocument();
    expect(screen.getByText('JvmMemoryUsed Component')).toBeInTheDocument();
    expect(screen.getByText('ProcessCpuUsage Component')).toBeInTheDocument();
    expect(screen.getByText('ProcessStartTime Component')).toBeInTheDocument();
    expect(screen.getByText('ProcessUptime Component')).toBeInTheDocument();
    expect(screen.getByText('SystemCpuCount Component')).toBeInTheDocument();
    expect(screen.getByText('SystemCpuUsage Component')).toBeInTheDocument();
    expect(screen.getByText('SystemLoadAverage Component')).toBeInTheDocument();
  });

  it('calls navigate on back button click', () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    render(<MetricsRoot />);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
