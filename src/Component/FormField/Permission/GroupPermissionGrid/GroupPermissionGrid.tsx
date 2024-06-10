import React, {
  useCallback
} from 'react';

import {
  useTranslation
} from 'react-i18next';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import PermissionCollectionType from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import Group from '@terrestris/shogun-util/dist/model/Group';
import GroupInstancePermission from '@terrestris/shogun-util/dist/model/security/GroupInstancePermission';
import GenericEntityService from '@terrestris/shogun-util/dist/service/GenericEntityService';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';
import InstancePermissionGrid, {
  DataType,
  InstancePermissionGridProps
} from '../InstancePermissionGrid/InstancePermissionGrid';

export interface GroupPermissionGridProps extends Omit<InstancePermissionGridProps<GroupInstancePermission>,
  'getInstancePermissions' | 'setInstancePermission' | 'deleteInstancePermission' | 'toDataType' |
  'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { };

const GroupPermissionGrid: React.FC<GroupPermissionGridProps> = ({
  entityType,
  ...passThroughProps
}) => {

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  const service = useCallback(() => {
    return (client?.[entityType] as () => GenericEntityService<BaseEntity>)();
  }, [client, entityType]);

  const getGroupInstancePermissions = async (id: number) => {
    return await service()?.getGroupInstancePermissions(id);
  };

  const setGroupInstancePermission = async (id: number, referenceId: number, permission: PermissionCollectionType) => {
    await service()?.setGroupInstancePermission(id, referenceId, permission);
  };

  const deleteGroupInstancePermission = async (id: number, referenceId: number) => {
    await service()?.deleteGroupInstancePermission(id, referenceId);
  };

  const getGroups = async (pageOpts?: PageOpts) => {
    return await client?.group().findAll(pageOpts);
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
        <span>{group.providerDetails?.name}</span>
      )
    };
  };

  const colDefinition = () => {
    return {
      sorter: (a: DataType<Group>, b: DataType<Group>) => {
        const aName = a.reference?.providerDetails?.name;
        const bName = b.reference?.providerDetails?.name;

        if (!aName || !bName) {
          return 0;
        }

        return bName.localeCompare(aName);
      }
    };
  };

  return (
    <InstancePermissionGrid
      entityType={entityType}
      getInstancePermissions={getGroupInstancePermissions}
      setInstancePermission={setGroupInstancePermission}
      deleteInstancePermission={deleteGroupInstancePermission}
      toDataType={toGroupDataType}
      nameColumnDefinition={colDefinition()}
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
