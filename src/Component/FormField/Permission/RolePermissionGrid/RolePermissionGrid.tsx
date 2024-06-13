import React, {
  useMemo
} from 'react';

import {
  Tag
} from 'antd';

import {
  CustomTagProps
} from 'rc-select/lib/BaseSelect';

import {
  useTranslation
} from 'react-i18next';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import PermissionCollectionType from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import Role from '@terrestris/shogun-util/dist/model/Role';
import RoleInstancePermission from '@terrestris/shogun-util/dist/model/security/RoleInstancePermission';
import GenericEntityService from '@terrestris/shogun-util/dist/service/GenericEntityService';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';
import InstancePermissionGrid, {
  DataType,
  InstancePermissionGridProps
} from '../InstancePermissionGrid/InstancePermissionGrid';

export interface RolePermissionGridProps extends Omit<InstancePermissionGridProps<RoleInstancePermission>,
  'getInstancePermissions' | 'setInstancePermission' | 'deleteInstancePermission' | 'toDataType' |
  'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { };

const RolePermissionGrid: React.FC<RolePermissionGridProps> = ({
  entityType,
  ...passThroughProps
}) => {

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  const service = useMemo(() => {
    return (client?.[entityType] as () => GenericEntityService<BaseEntity>)();
  }, [client, entityType]);

  const getRoleInstancePermissions = async (id: number) => {
    return await service?.getRoleInstancePermissions(id);
  };

  const setRoleInstancePermission = async (id: number, referenceId: number, permission: PermissionCollectionType) => {
    await service?.setRoleInstancePermission(id, referenceId, permission);
  };

  const deleteRoleInstancePermission = async (id: number, referenceId: number) => {
    await service?.deleteRoleInstancePermission(id, referenceId);
  };

  const getRoles = async (pageOpts?: PageOpts) => {
    return await client?.role().findAll(pageOpts);
  };

  const toRoleDataType = (permission: RoleInstancePermission): DataType<Role> => {
    return {
      key: permission.role?.id,
      reference: permission.role,
      name: permission.role?.providerDetails?.name,
      permission: permission.permission?.name
    };
  };

  const toTag = (role: Role) => {
    return {
      value: role.id,
      filterValues: [
        role.providerDetails?.name
      ],
      label: (
        <span>{role.providerDetails?.name}</span>
      )
    };
  };

  const tagRenderer = (props: CustomTagProps) => {
    const {
      label,
      ...passProps
    } = props;

    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        className="user-avatar-tag"
        {...passProps}
      >
        {label}
      </Tag>
    );
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
      modalProps={{
        toTag: toTag,
        getReferences: getRoles,
        tagRenderer: tagRenderer,
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
      }}
      {...passThroughProps}
    />
  );
};

export default RolePermissionGrid;
