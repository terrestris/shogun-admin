import React from 'react';

import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import UserUtil from '../../../Util/UserUtil';

import { User } from './User';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));

jest.mock('recoil', () => {
  const actualRecoil = jest.requireActual('recoil');

  return {
    ...actualRecoil,
    useRecoilState: jest.fn(),
    useRecoilValue: jest.fn(),
    useSetRecoilState: jest.fn(),
  };
});

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

  const mockSetInfoVisible = jest.fn();

  beforeEach(() => {
    (useSHOGunAPIClient as jest.Mock).mockReturnValue(mockClient);
    (useRecoilState as jest.Mock)
      .mockReturnValueOnce([mockUserInfo, jest.fn()])
      .mockReturnValueOnce([false, mockSetInfoVisible]);

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

  it('should render user avatar and username', () => {
    render(<User />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'gravatar-url');
  });

  it('opens the dropdown menu with correct items', () => {
    render(<User />);

    fireEvent.click(screen.getByRole('img'));

    expect(screen.getByText('User.settings')).toBeInTheDocument();
    expect(screen.getByText('User.info')).toBeInTheDocument();
    expect(screen.getByText('User.logout')).toBeInTheDocument();
  });

  it('should trigger account management on settings click', () => {
    render(<User />);

    fireEvent.click(screen.getByRole('img'));
    fireEvent.click(screen.getByText('User.settings'));

    expect(mockClient.getKeycloak().accountManagement).toHaveBeenCalled();
  });

  it('shows info modal on info click', () => {
    render(<User />);

    fireEvent.click(screen.getByRole('img'));
    fireEvent.click(screen.getByText('User.info'));

    expect(mockSetInfoVisible).toHaveBeenCalledWith(true);
    expect(mockSetInfoVisible).toHaveBeenCalledTimes(1);
  });

  it('triggers logout on logout click', () => {
    render(<User />);

    fireEvent.click(screen.getByRole('img'));
    fireEvent.click(screen.getByText('User.logout'));

    expect(mockClient.getKeycloak().logout).toHaveBeenCalled();
  });
});
