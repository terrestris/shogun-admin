import React, {
  useCallback,
  useMemo
} from 'react';

import {
  useTranslation
} from 'react-i18next';

import { PermissionCollectionType } from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import Group from '@terrestris/shogun-util/dist/model/Group';
import GroupInstancePermission from '@terrestris/shogun-util/dist/model/security/GroupInstancePermission';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';
import InstancePermissionGrid, {
  DataType,
  InstancePermissionGridProps
} from '../InstancePermissionGrid/InstancePermissionGrid';

export interface GroupPermissionGridProps extends Omit<InstancePermissionGridProps<GroupInstancePermission>,
  'getInstancePermissions' | 'setInstancePermission' | 'deleteInstancePermission' | 'toDataType' |
  'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { }

const GroupPermissionGrid: React.FC<GroupPermissionGridProps> = ({
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

  const getGroupInstancePermissions = useCallback(async (id: number) => {
    return await service()?.getGroupInstancePermissions(id);
  }, [service]);

  const setGroupInstancePermission = useCallback(async (id: number, referenceId: number,
    permission: PermissionCollectionType) => {
    await service()?.setGroupInstancePermission(id, referenceId, permission);
  }, [service]);

  const deleteGroupInstancePermission = useCallback(async (id: number, referenceId: number) => {
    await service()?.deleteGroupInstancePermission(id, referenceId);
  }, [service]);

  const getGroups = useCallback(async (pageOpts?: PageOpts) => {
    return await client?.group().findAll(pageOpts);
  }, [client]);

  const modalProps = useMemo(() => ({
    toTag: (group: Group) => {
      return {
        value: group.id,
        filterValues: [
          group.id,
          group.authProviderId,
          group.providerDetails?.name
        ],
        label: (
          <span>{group.providerDetails?.name || `ID: ${group.id}`}</span>
        )
      };
    },
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
  }), [getGroups, setGroupInstancePermission, t]);

  const toGroupDataType = (permission: GroupInstancePermission): DataType<Group> => {
    return {
      key: permission.group?.id,
      reference: permission.group,
      name: permission.group?.providerDetails?.name,
      permission: permission.permission?.name
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
      modalProps={modalProps}
      {...passThroughProps}
    />
  );
};

export default GroupPermissionGrid;
