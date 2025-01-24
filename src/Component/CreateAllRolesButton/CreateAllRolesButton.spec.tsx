import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

import { CreateAllRolesButton } from './CreateAllRolesButton';
import RoleService from '@terrestris/shogun-util/dist/service/RoleService';
import Role from '@terrestris/shogun-util/dist/model/Role';

import type { PartialOmit } from '../../test-util';

const mockService: Partial<RoleService<Role>> = {
  createAllFromProvider: jest.fn()
};

const mockSHOGunAPIClient: PartialOmit<SHOGunAPIClient, 'role'> = {
  role: jest.fn().mockReturnValue(mockService)
};

jest.mock('../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

describe('<CreateAllRolesButton />', () => {

  afterEach(cleanup);

  it('can be rendered', () => {
    const {
      container
    } = render(
      <CreateAllRolesButton />);

    expect(container).toBeVisible();
  });

  it('calls the appropriate service method', async () => {
    render(<CreateAllRolesButton />);

    const buttonElement = screen.getByText('CreateAllRolesButton.title');

    fireEvent.click(buttonElement);

    expect(mockSHOGunAPIClient.role().createAllFromProvider).toHaveBeenCalled();

    await waitForElementToBeRemoved(() => screen.queryByLabelText('loading'));

    expect(screen.getByText('CreateAllRolesButton.success')).toBeVisible();
  });
});
