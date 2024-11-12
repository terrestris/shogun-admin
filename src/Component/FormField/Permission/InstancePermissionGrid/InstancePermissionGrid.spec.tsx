import React from 'react';

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen
} from '@testing-library/react';

import { DefaultOptionType } from 'antd/lib/select';
import { ColumnType } from 'antd/lib/table';

import { t } from 'i18next';

import InstancePermission from '@terrestris/shogun-util/dist/model/security/InstancePermission';
import User, { KeycloakUserRepresentation } from '@terrestris/shogun-util/dist/model/User';

import InstancePermissionGrid, { DataType, EntityType } from './InstancePermissionGrid';

let mockEntityType: EntityType;
let mockModalProps;
let mockToTag: (reference: User) => DefaultOptionType;
let mockColumnDefinition: ColumnType<DataType>;
let mockToDataType;

const mockDeletePermission = jest.fn();
const mockSetPermission = jest.fn();

const mockKeycloakUser: KeycloakUserRepresentation = {
  self: 'http://example.com/self',
  id: '12345',
  origin: 'origin-system',
  createdTimestamp: 1625234875000,
  username: 'mockuser',
  enabled: true,
  firstName: 'Mock',
  lastName: 'User',
  email: 'mockuser@example.com',
};

const mockUser = new User<KeycloakUserRepresentation>({
  id: 0,
  created: '2024-07-23',
  modified: '2024-07-23',
  details: { additional: 'details' },
  clientConfig: { some: 'config' },
  authProviderId: 'auth-provider-id',
  providerDetails: mockKeycloakUser
});

const mockSHOGunAPIClient = {
  user: jest.fn().mockReturnValue(mockUser)
};

jest.mock('../../../../Hooks/useSHOGunAPIClient.ts', () => {
  const originalModule = jest.requireActual('../../../../Hooks/useSHOGunAPIClient.ts');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockSHOGunAPIClient)
  };
});

describe('<InstancePermissionGrid />', () => {
  beforeEach(() => {
    mockEntityType = 'group';

    mockToTag = (reference: User) => {
      return {
        value: reference.id,
        filterValues: [
          reference.providerDetails?.username,
          reference.providerDetails?.email
        ],
        label: (
          <span>{reference.providerDetails?.username}</span>
        )
      };
    };

    mockModalProps = {
      toTag: jest.fn(() => mockToTag(mockUser)),
      getReferences: jest.fn(),
      setInstancePermission: jest.fn(() => mockSetPermission(1, 1, 'CREATE')),
      descriptionText: 'description',
      referenceLabelText: 'referenceSelectLabel',
      referenceExtraText: 'referenceSelectExtra',
      referenceSelectPlaceholderText: 'referenceSelectPlaceholder',
      permissionSelectLabel: 'permissionSelectLabel',
      permissionSelectExtra: 'permissionSelectExtra',
      saveErrorMsg: (placeholder: string) => {
        return t('saveErrorMsg', {
          referenceIds: placeholder
        });
      }
    };

    mockToDataType = (permission: InstancePermission): DataType => ({
      key: permission.id,
      name: `Permission ${permission.id}`,
      permission: permission.permission[0],
      reference: mockUser
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(InstancePermissionGrid).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } = render(
      <InstancePermissionGrid
        entityId={1}
        entityType={mockEntityType}
        getInstancePermissions={jest.fn()}
        setInstancePermission={jest.fn()}
        deleteInstancePermission={jest.fn()}
        toDataType={jest.fn()}
        nameColumnDefinition={mockColumnDefinition}
        modalProps={mockModalProps}
      />);
    expect(container).toBeVisible();

    expect(container.querySelector('.instance-permission-grid')).toBeVisible();
    expect(container.querySelector('.ant-spin-container')).toBeVisible();
    expect(container.innerHTML).toContain('InstancePermissionGrid.nameColumnTitle');
    expect(container.innerHTML).toContain('InstancePermissionGrid.permissionColumnTitle');
    const tableElement = container.querySelector('.ant-table-tbody');
    expect(tableElement?.querySelector('.ant-table-cell')).toHaveAttribute('colspan', '3');
    expect(tableElement?.querySelector('.ant-empty-image')).toBeVisible();
    expect(container.querySelector('.ant-empty-description')?.innerHTML).toBe('No data');
  });

  it('is rendered with all columns', async () => {

    const mockPermissions: InstancePermission[] = [
      new InstancePermission({
        id: 1,
        created: new Date(),
        modified: new Date(),
        entityId: 1,
        permission: {
          permissions: ['ADMIN', 'CREATE', 'DELETE', 'UPDATE', 'READ'],
          name: 'CREATE'
        }
      }),
    ];

    const mockGetPermission = jest.fn().mockResolvedValue(mockPermissions);

    const {
      container
    } = render(
      <InstancePermissionGrid
        entityId={1}
        entityType={mockEntityType}
        getInstancePermissions={mockGetPermission}
        setInstancePermission={mockSetPermission}
        deleteInstancePermission={mockDeletePermission}
        toDataType={mockToDataType}
        nameColumnDefinition={mockColumnDefinition}
        modalProps={mockModalProps}
        id={'id'}
      />
    );
    expect(mockGetPermission).toHaveBeenCalled();

    const operationColumn = container.querySelector('.operation-column');
    expect(operationColumn).toBeVisible();
    expect(operationColumn).toHaveAttribute('scope', 'col');
    await operationColumn?.querySelector('button')?.click();

    const dropdownTrigger: HTMLElement | null = container.querySelector('.ant-dropdown-trigger');
    await fireEvent.click(dropdownTrigger!);
    const dropdownButton: HTMLElement | null = container.querySelector('.ant-dropdown-open');
    await fireEvent.click(dropdownButton!);

    await waitFor(() => expect(mockGetPermission).toHaveBeenCalled());

    const selectElements: HTMLElement[] | null = screen.getAllByText('PermissionSelect.placeholder');
    await waitFor(() => expect(selectElements![0]).toBeVisible());

    const permissionElements: HTMLElement[] | null = screen.getAllByText('Permission 1');
    await waitFor(() => expect(permissionElements![0]).toBeVisible());

    const deleteElement: HTMLElement | null = container.querySelector('svg[data-icon="delete"]');
    await waitFor(() => expect(deleteElement).toBeVisible());
  });
});
