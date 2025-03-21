import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

import { CreateAllUsersButton } from './CreateAllUsersButton';
import UserService from '@terrestris/shogun-util/dist/service/UserService';
import User from '@terrestris/shogun-util/dist/model/User';

import type { PartialOmit } from '../../test-util';

const mockService: Partial<UserService<User>> = {
  createAllFromProvider: jest.fn()
};

const mockSHOGunAPIClient: PartialOmit<SHOGunAPIClient, 'user'> = {
  user: jest.fn().mockReturnValue(mockService)
};

jest.mock('../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

describe('<CreateAllUsersButton />', () => {

  afterEach(cleanup);

  it('can be rendered', () => {
    const {
      container
    } = render(
      <CreateAllUsersButton />);

    expect(container).toBeVisible();
  });

  it('calls the appropriate service method', async () => {
    render(<CreateAllUsersButton />);

    const buttonElement = screen.getByText('CreateAllUsersButton.title');

    fireEvent.click(buttonElement);

    expect(mockSHOGunAPIClient.user().createAllFromProvider).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('CreateAllUsersButton.success')).toBeVisible();
    });
  });
});
