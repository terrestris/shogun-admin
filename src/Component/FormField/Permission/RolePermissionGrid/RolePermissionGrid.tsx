import React, {
  useCallback,
  useMemo
} from 'react';

import {
  useTranslation
} from 'react-i18next';

import { PermissionCollectionType } from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import Role from '@terrestris/shogun-util/dist/model/Role';
import RoleInstancePermission from '@terrestris/shogun-util/dist/model/security/RoleInstancePermission';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';
import InstancePermissionGrid, {
  DataType,
  InstancePermissionGridProps
} from '../InstancePermissionGrid/InstancePermissionGrid';

export interface RolePermissionGridProps extends Omit<InstancePermissionGridProps<RoleInstancePermission>,
  'getInstancePermissions' | 'setInstancePermission' | 'deleteInstancePermission' | 'toDataType' |
  'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { }

const RolePermissionGrid: React.FC<RolePermissionGridProps> = ({
  entityType,
  ...passThroughProps
}) => {

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  const service = useCallback(() => {
    // @ts-expect-error for unknown reasons, just calling the function here will result in 'this'
    // not being defined in the function, so 'apply' is used to set 'this' correctly
    return client?.[entityType].apply(client);
  }, [client, entityType]);

  const getRoleInstancePermissions = useCallback(async (id: number) => {
    return await service()?.getRoleInstancePermissions(id);
  }, [service]);

  const setRoleInstancePermission = useCallback(async (id: number, referenceId: number,
    permission: PermissionCollectionType) => {
    await service()?.setRoleInstancePermission(id, referenceId, permission);
  }, [service]);

  const deleteRoleInstancePermission = useCallback(async (id: number, referenceId: number) => {
    await service()?.deleteRoleInstancePermission(id, referenceId);
  }, [service]);

  const getRoles = useCallback(async (pageOpts?: PageOpts) => {
    return await client?.role().findAll(pageOpts);
  }, [client]);

  const modalProps = useMemo(() => ({
    toTag: (role: Role) => {
      return {
        value: role.id,
        filterValues: [
          role.providerDetails?.name
        ],
        label: (
          <span>{role.providerDetails?.name || `ID: ${role.id}`}</span>
        )
      };
    },
    getReferences: getRoles,
    setInstancePermission: setRoleInstancePermission,
    descriptionText: t('RolePermissionGrid.modal.description'),
    referenceLabelText: t('RolePermissionGrid.modal.referenceSelectLabel'),
    referenceExtraText: t('RolePermissionGrid.modal.referenceSelectExtra'),
    referenceSelectPlaceholderText: t('RolePermissionGrid.modal.referenceSelectPlaceholder'),
    permissionSelectLabel: t('RolePermissionGrid.modal.permissionSelectLabel'),
    permissionSelectExtra: t('RolePermissionGrid.modal.permissionSelectExtra'),
    saveErrorMsg: (placeholder: string) => {
      return t('RolePermissionGrid.modal.saveErrorMsg', {
        referenceIds: placeholder
      });
    }
  }), [getRoles, setRoleInstancePermission, t]);

  const toRoleDataType = (permission: RoleInstancePermission): DataType<Role> => {
    return {
      key: permission.role?.id,
      reference: permission.role,
      name: permission.role?.providerDetails?.name,
      permission: permission.permission?.name
    };
  };

  const colDefinition = () => {
    return {
      sorter: (a: DataType<Role>, b: DataType<Role>) => {
        const aName = a.reference?.providerDetails?.name;
        const bName = b.reference?.providerDetails?.name;

        if (!aName || !bName) {
          return 0;
        }

        return aName.localeCompare(bName);
      }
    };
  };

  return (
    <InstancePermissionGrid
      entityType={entityType}
      getInstancePermissions={getRoleInstancePermissions}
      setInstancePermission={setRoleInstancePermission}
      deleteInstancePermission={deleteRoleInstancePermission}
      toDataType={toRoleDataType}
      nameColumnDefinition={colDefinition()}
      modalProps={modalProps}
      {...passThroughProps}
    />
  );
};

export default RolePermissionGrid;
