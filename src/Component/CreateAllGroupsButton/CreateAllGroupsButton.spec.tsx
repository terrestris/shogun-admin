import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import SHOGunAPIClient from '@terrestris/shogun-util/dist/service/SHOGunAPIClient';

import { CreateAllGroupsButton } from './CreateAllGroupsButton';
import GroupService from '@terrestris/shogun-util/dist/service/GroupService';
import Group from '@terrestris/shogun-util/dist/model/Group';

import type { PartialOmit } from '../../test-util';

const mockService: Partial<GroupService<Group>> = {
  createAllFromProvider: jest.fn()
};

const mockSHOGunAPIClient: PartialOmit<SHOGunAPIClient, 'group'> = {
  group: jest.fn().mockReturnValue(mockService)
};

jest.mock('../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

describe('<CreateAllGroupsButton />', () => {

  afterEach(cleanup);

  it('can be rendered', () => {
    const {
      container
    } = render(
      <CreateAllGroupsButton />);

    expect(container).toBeVisible();
  });

  it('calls the appropriate service method', async () => {
    render(<CreateAllGroupsButton />);

    const buttonElement = screen.getByText('CreateAllGroupsButton.title');

    fireEvent.click(buttonElement);

    expect(mockSHOGunAPIClient.group().createAllFromProvider).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('CreateAllGroupsButton.success')).toBeVisible();
    });
  });
});
