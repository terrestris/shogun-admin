import React from 'react';

import {
  cleanup,
  render
} from '@testing-library/react';

import User, { KeycloakUserRepresentation } from '@terrestris/shogun-util/dist/model/User';

import PermissionModal from './PermissionModal';

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
  created: new Date(),
  modified: new Date(),
  details: { additional: 'details' },
  clientConfig: { some: 'config' },
  authProviderId: 'auth-provider-id',
  providerDetails: mockKeycloakUser
});

describe('<PermissionModal />', () => {
  afterEach(() => {
    cleanup();
  });

  it('is defined', () => {
    expect(PermissionModal).not.toBeUndefined();
  });

  it('can be rendered', async () => {
    const {
      container
    } =
      render(<PermissionModal
        entityId={1}
        toTag={jest.fn(() => mockUser)}
        setInstancePermission={jest.fn(() => mockSetPermission(1, 1, 'CREATE'))}
        getReferences={jest.fn()}
        descriptionText={'description'}
        referenceLabelText={'referenceSelectLabel'}
        referenceExtraText={'referenceSelectExtra'}
        referenceSelectPlaceholderText={'referenceSelectPlaceholder'}
        permissionSelectLabel={'permissionSelectLabel'}
        permissionSelectExtra={'permissionSelectExtra'}
        saveErrorMsg={() => {
          return 'saveErrorMsg';
        }}
      />);
    expect(container).toBeVisible();
  });
});
