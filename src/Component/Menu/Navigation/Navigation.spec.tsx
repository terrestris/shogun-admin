import React from 'react';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import {
  MemoryRouter,
  useLocation,
  useNavigate
} from 'react-router-dom';

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

    expect(screen.getByText('Navigation.content')).toBeInTheDocument();
    expect(screen.getByText('Navigation.status')).toBeInTheDocument();
    expect(screen.getByText('Navigation.configuration')).toBeInTheDocument();
    expect(screen.getByText('Navigation.image')).toBeInTheDocument();

    const statusItem = screen.getByText('Navigation.status');
    fireEvent.click(statusItem);
    await waitFor(() => {
      expect(screen.getByText('Navigation.metrics')).toBeInTheDocument();
      expect(screen.getByText('Navigation.logs')).toBeInTheDocument();
    });

    const settingsItem = screen.getByText('Navigation.configuration');
    fireEvent.click(settingsItem);
    await waitFor(() => {
      expect(screen.getByText('Navigation.global')).toBeInTheDocument();
      expect(screen.getByText('Navigation.logLevels')).toBeInTheDocument();
    });
  });

  it('opens submenu when an item is selected', async () => {
    render(
      <MemoryRouter>
        <Navigation collapsed={false} />
      </MemoryRouter>
    );

    const statusItem = screen.getByText('Navigation.status');
    fireEvent.click(statusItem);

    await waitFor(() => {
      expect(screen.getByText('Navigation.status').closest('li')).toHaveClass('ant-menu-submenu-open');
    });
  });

  it('navigates to the correct route when an item is selected', async () => {
    render(
      <MemoryRouter>
        <Navigation collapsed={false} />
      </MemoryRouter>
    );

    const statusItem = screen.getByText('Navigation.status');
    fireEvent.click(statusItem);

    await waitFor(() => {
      expect(screen.getByText('Navigation.logs')).toBeInTheDocument();
    });

    const logsItem = screen.getByText('Navigation.logs');
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

  it('renders default and custom entries in the navigation bar', async () => {
    const defaultEntry = {
      entityType: 'application',
      entityName: '#i18n.entityName',
      endpoint: '/applications',
      navigationTitle: "#i18n.navigationTitle",
      formConfig: {
        name: 'application',
        fields: [{
          dataField: 'name',
          readOnly: true
        }]
      },
      i18n: {
        de: {
          entityName: 'Applikation',
          navigationTitle: 'Applikationen',
          titleName: 'Name'
        },
        en: {
          entityName: 'Application',
          navigationTitle: 'Applications',
          titleName: 'Name'
        }
      },
      tableConfig: {
        columnDefinition: [{
          title: '#i18n.titleName',
          dataIndex: 'name',
          key: 'name'
        }]
      }
    };

    const customEntry = {
      entityType: 'myEntity',
      entityName: '#i18n.entityName',
      endpoint: '/myEntities',
      navigationTitle: "#i18n.navigationTitle",
      formConfig: {
        name: 'myEntity',
        fields: [{
          dataField: 'name',
          readOnly: true
        }]
      },
      i18n: {
        de: {
          entityName: 'MyEntity',
          navigationTitle: 'MyEntities',
          titleName: 'Name'
        },
        en: {
          entityName: 'MyEntity',
          navigationTitle: 'MyEntities',
          titleName: 'Name'
        }
      },
      tableConfig: {
        columnDefinition: [{
          title: '#i18n.titleName',
          dataIndex: 'name',
          key: 'name'
        }]
      }
    };

    render(
      <MemoryRouter>
        <Navigation
          entityConfigs={[
            defaultEntry,
            customEntry
          ]}
        />
      </MemoryRouter>
    );

    const applicationEntry = await waitFor(() => screen.getByText('Applications'));
    const myEntityEntry = await waitFor(() => screen.getByText('MyEntities'));

    expect(applicationEntry).toBeInTheDocument();
    expect(myEntityEntry).toBeInTheDocument();
  });
});
