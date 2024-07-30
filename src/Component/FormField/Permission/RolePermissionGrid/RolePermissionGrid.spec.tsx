import React from 'react';

import {
  cleanup,
  render,
} from '@testing-library/react';

import { EntityType } from '../InstancePermissionGrid/InstancePermissionGrid';

import RolePermissionGrid from './RolePermissionGrid';

let mockEntityType: EntityType;

const mockService = {
  findAllNoPaging: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  updatePartial: jest.fn(),
  delete: jest.fn(),
  isPublic: jest.fn(),
  setPublic: jest.fn(),
  revokePublic: jest.fn(),
  getBasePath: jest.fn(),
};

const mockSHOGunAPIClient = {
  group: jest.fn(() => mockService),
};

jest.mock('../../../../Hooks/useSHOGunAPIClient', () => {
  const originalModule = jest.requireActual('../../../../Hooks/useSHOGunAPIClient');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

describe('<RolePermissionGrid />', () => {

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(RolePermissionGrid).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    mockEntityType = 'group';

    const {
      container
    } = render(
      <RolePermissionGrid
        entityId={1}
        entityType={mockEntityType}
      />);
    expect(container).toBeVisible();
  });
});
