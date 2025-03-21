import React from 'react';

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';

import { useTranslation } from 'react-i18next';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import UserUtil from '../../../Util/UserUtil';

import { User } from './User';
import { createReduxWrapper } from '../../../test-util';
import { store } from '../../../store/store';
import { setUserInfo } from '../../../store/userInfo';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));

jest.mock('../../../Hooks/useSHOGunAPIClient', () => jest.fn());
jest.mock('../../../Util/UserUtil', () => ({
  getGravatarUrl: jest.fn(),
  getInitials: jest.fn()
}));

describe('<User />', () => {
  const mockClient = {
    getKeycloak: jest.fn().mockReturnValue({
      accountManagement: jest.fn(),
      logout: jest.fn()
    })
  };

  const mockUserInfo = {
    providerDetails: {
      email: 'user@example.com',
      username: 'testuser'
    },
    authProviderId: 'testuser'
  };

  beforeEach(() => {
    (useSHOGunAPIClient as jest.Mock).mockReturnValue(mockClient);
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key
    });

    (UserUtil.getGravatarUrl as jest.Mock).mockReturnValue('gravatar-url');
    (UserUtil.getInitials as jest.Mock).mockReturnValue('TU');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is defined', () => {
    expect(User).not.toBeUndefined();
  });

  it('should render user avatar and username', async () => {
    render(
      <User />, {
        wrapper: createReduxWrapper()
      }
    );

    act(() => {
      store.dispatch(setUserInfo(mockUserInfo));
    });

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'gravatar-url');
  });

  it('opens the dropdown menu with correct items', async () => {
    render(
      <User />, {
        wrapper: createReduxWrapper()
      }
    );

    act(() => {
      store.dispatch(setUserInfo(mockUserInfo));
    });

    fireEvent.click(screen.getByRole('img'));

    await waitFor(() => {
      expect(screen.getByText('User.settings')).toBeInTheDocument();
      expect(screen.getByText('User.info')).toBeInTheDocument();
      expect(screen.getByText('User.logout')).toBeInTheDocument();
    });
  });

  it('should trigger account management on settings click', async () => {
    render(
      <User />, {
        wrapper: createReduxWrapper()
      }
    );

    act(() => {
      store.dispatch(setUserInfo(mockUserInfo));
    });

    fireEvent.click(screen.getByRole('img'));
    fireEvent.click(screen.getByText('User.settings'));

    await waitFor(() => {
      expect(mockClient.getKeycloak().accountManagement).toHaveBeenCalled();
    });
  });

  it('shows info modal on info click', async () => {
    render(
      <User />, {
        wrapper: createReduxWrapper()
      }
    );

    act(() => {
      store.dispatch(setUserInfo(mockUserInfo));
    });

    fireEvent.click(screen.getByRole('img'));
    fireEvent.click(screen.getByText('User.info'));

    await waitFor(() => {
      expect(store.getState().infoModal).toEqual(true);
    });
  });

  it('triggers logout on logout click', async () => {
    render(
      <User />, {
        wrapper: createReduxWrapper()
      }
    );

    act(() => {
      store.dispatch(setUserInfo(mockUserInfo));
    });

    fireEvent.click(screen.getByRole('img'));
    fireEvent.click(screen.getByText('User.logout'));

    await waitFor(() => {
      expect(mockClient.getKeycloak().logout).toHaveBeenCalled();
    });
  });
});
