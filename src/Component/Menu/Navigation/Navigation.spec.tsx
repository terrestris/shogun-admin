import React from 'react';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';

import { Navigation } from './Navigation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock('shogunApplicationConfig', () => ({
  appPrefix: '/app',
  navigation: {
    general: {
      imagefiles: { visible: true }
    },
    status: {
      metrics: { visible: true },
      logs: { visible: true }
    },
    settings: {
      global: { visible: true },
      logs: { visible: true }
    }
  }
}));

describe('<Navigation />', () => {
  const mockNavigate = jest.fn();
  const mockLocation = {
    pathname: '/app/portal/status/logs'
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is defined', () => {
    expect(Navigation).not.toBeUndefined();
  });

  it('renders navigation menu with correct items', async () => {
    const {
      container
    } = render(
      <MemoryRouter>
        <Navigation collapsed={false} />
      </MemoryRouter>
    );
    expect(container).toBeVisible();

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();

    const statusItem = screen.getByText('Status');
    fireEvent.click(statusItem);
    await waitFor(() => {
      expect(screen.getByText('Metrics')).toBeInTheDocument();
      expect(screen.getByText('Logs')).toBeInTheDocument();
    });

    const settingsItem = screen.getByText('Configuration');
    fireEvent.click(settingsItem);
    await waitFor(() => {
      expect(screen.getByText('Global')).toBeInTheDocument();
      expect(screen.getByText('Logging levels')).toBeInTheDocument();
    });


  });

  it('opens submenu when an item is selected', async () => {
    render(
      <MemoryRouter>
        <Navigation collapsed={false} />
      </MemoryRouter>
    );

    const statusItem = screen.getByText('Status');
    fireEvent.click(statusItem);

    await waitFor(() => {
      expect(screen.getByText('Status').closest('li')).toHaveClass('ant-menu-submenu-open');
    });
  });

  it('navigates to the correct route when an item is selected', async () => {
    render(
      <MemoryRouter>
        <Navigation collapsed={false} />
      </MemoryRouter>
    );

    const statusItem = screen.getByText('Status');
    fireEvent.click(statusItem);

    await waitFor(() => {
      expect(screen.getByText('Logs')).toBeInTheDocument();
    });

    const logsItem = screen.getByText('Logs');
    fireEvent.click(logsItem);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/app/portal/status/logs');
    });
  });

  it('renders with collapsed state', () => {
    const { container } = render(
      <MemoryRouter>
        <Navigation collapsed={true} />
      </MemoryRouter>
    );

    expect(container.querySelector('.ant-menu-inline-collapsed')).toBeInTheDocument();
  });

});
