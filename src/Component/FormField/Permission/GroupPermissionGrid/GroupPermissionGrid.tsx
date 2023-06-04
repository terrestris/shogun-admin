import React, {
  useCallback
} from 'react';

import {
  useTranslation
} from 'react-i18next';

import PermissionCollectionType from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import GroupInstancePermission from '@terrestris/shogun-util/dist/model/security/GroupInstancePermission';
import Group from '@terrestris/shogun-util/dist/model/Group';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import GenericService from '@terrestris/shogun-util/dist/service/GenericService';

import InstancePermissionGrid, {
  DataType,
  InstancePermissionGridProps
} from '../InstancePermissionGrid/InstancePermissionGrid';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';

export interface GroupPermissionGridProps extends Omit<InstancePermissionGridProps,
  'getInstancePermissions' | 'setInstancePermission' | 'deleteInstancePermission' | 'toDataType' |
  'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { };

const GroupPermissionGrid: React.FC<GroupPermissionGridProps> = ({
  entityType,
  ...passThroughProps
}) => {

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  const service = useCallback(() => {
    return client[entityType]() as GenericService<BaseEntity>;
  }, [client, entityType]);

  const getGroupInstancePermissions = async (id: number) => {
    return await service().getGroupInstancePermissions(id);
  };

  const setGroupInstancePermission = async (id: number, referenceId: number, permission: PermissionCollectionType) => {
    await service().setGroupInstancePermission(id, referenceId, permission);
  };

  const deleteGroupInstancePermission = async (id: number, referenceId: number) => {
    await service().deleteGroupInstancePermission(id, referenceId);
  };

  const getGroups = async () => {
    return await client.group().findAll();
  };

  const toGroupDataType = (permission: GroupInstancePermission): DataType<Group> => {
    return {
      key: permission.group?.id,
      reference: permission.group,
      name: permission.group?.providerDetails?.name,
      permission: permission.permission?.name
    };
  };

  const toTag = (group: Group) => {
    return {
      value: group.id,
      filterValues: [
        group.id,
        group.authProviderId,
        group.providerDetails?.name
      ],
      label: (
        <span>{group.providerDetails.name}</span>
      )
    };
  };

  const colDefinition = () => {
    return {
      sorter: (a: DataType<Group>, b: DataType<Group>) => {
        return a.reference?.providerDetails?.name?.localeCompare(b.reference?.providerDetails?.name);
      }
    };
  };

  return (
    <InstancePermissionGrid
      getInstancePermissions={getGroupInstancePermissions}
      setInstancePermission={setGroupInstancePermission}
      deleteInstancePermission={deleteGroupInstancePermission}
      toDataType={toGroupDataType}
      nameColumnDefinition={colDefinition()}
      entityType={entityType}
      modalProps={{
        toTag: toTag,
        getReferences: getGroups,
        setInstancePermission: setGroupInstancePermission,
        descriptionText: t('GroupPermissionGrid.modal.description'),
        referenceLabelText: t('GroupPermissionGrid.modal.referenceSelectLabel'),
        referenceExtraText: t('GroupPermissionGrid.modal.referenceSelectExtra'),
        referenceSelectPlaceholderText: t('GroupPermissionGrid.modal.referenceSelectPlaceholder'),
        permissionSelectLabel: t('GroupPermissionGrid.modal.permissionSelectLabel'),
        permissionSelectExtra: t('GroupPermissionGrid.modal.permissionSelectExtra'),
        saveErrorMsg: (placeholder: string) => {
          return t('GroupPermissionGrid.modal.saveErrorMsg', {
            referenceIds: placeholder
          });
        }
      }}
      {...passThroughProps}
    />
  );
};

export default GroupPermissionGrid;
