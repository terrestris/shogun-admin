import React, {
  useCallback
} from 'react';

import {
  useTranslation
} from 'react-i18next';

import {
  Tag
} from 'antd';

import {
  CustomTagProps
} from 'rc-select/lib/BaseSelect';

import PermissionCollectionType from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import UserInstancePermission from '@terrestris/shogun-util/dist/model/security/UserInstancePermission';
import User from '@terrestris/shogun-util/dist/model/User';
import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';
import GenericService from '@terrestris/shogun-util/dist/service/GenericService';

import InstancePermissionGrid, {
  DataType,
  InstancePermissionGridProps
} from '../InstancePermissionGrid/InstancePermissionGrid';
import UserAvatar from '../../../UserAvatar/UserAvatar';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';

import './UserPermissionGrid.less';

export interface UserPermissionGridProps extends Omit<InstancePermissionGridProps,
'getInstancePermissions' | 'setInstancePermission' | 'deleteInstancePermission' | 'toDataType' |
'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { };

const UserPermissionGrid: React.FC<UserPermissionGridProps> = ({
  entityType,
  ...passThroughProps
}) => {

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  const service = useCallback(() => {
    return client[entityType]() as GenericService<BaseEntity>;
  }, [client, entityType]);

  const getUserInstancePermissions = async (id: number) => {
    return await service().getUserInstancePermissions(id);
  };

  const setUserInstancePermission = async (id: number, referenceId: number, permission: PermissionCollectionType) => {
    await service().setUserInstancePermission(id, referenceId, permission);
  };

  const deleteUserInstancePermission = async (id: number, referenceId: number) => {
    await service().deleteUserInstancePermission(id, referenceId);
  };

  const getUsers = async () => {
    return await client.user().findAll();
  };

  const toUserDataType = (permission: UserInstancePermission): DataType<User> => {
    return {
      key: permission.user?.id,
      reference: permission.user,
      name: permission.user?.providerDetails?.username,
      permission: permission.permission?.name
    };
  };

  const toTag = (user: User) => {
    return {
      value: user.id,
      filterValues: [
        user.providerDetails?.firstName,
        user.providerDetails?.lastName,
        user.providerDetails?.username,
        user.providerDetails?.email
      ],
      label: (
        <UserAvatar
          user={user}
        />
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
      sorter: (a: DataType<User>, b: DataType<User>) => {
        return a.reference?.providerDetails?.username?.localeCompare(b.reference?.providerDetails?.username);
      },
      render: (value: any, record: DataType) => (
        <UserAvatar
          user={record.reference}
        />
      )
    };
  };

  return (
    <InstancePermissionGrid
      getInstancePermissions={getUserInstancePermissions}
      setInstancePermission={setUserInstancePermission}
      deleteInstancePermission={deleteUserInstancePermission}
      toDataType={toUserDataType}
      nameColumnDefinition={colDefinition()}
      entityType={entityType}
      modalProps={{
        toTag: toTag,
        getReferences: getUsers,
        tagRenderer: tagRenderer,
        setInstancePermission: setUserInstancePermission,
        descriptionText: t('UserPermissionGrid.modal.description'),
        referenceLabelText: t('UserPermissionGrid.modal.referenceSelectLabel'),
        referenceExtraText: t('UserPermissionGrid.modal.referenceSelectExtra'),
        referenceSelectPlaceholderText: t('UserPermissionGrid.modal.referenceSelectPlaceholder'),
        permissionSelectLabel: t('UserPermissionGrid.modal.permissionSelectLabel'),
        permissionSelectExtra: t('UserPermissionGrid.modal.permissionSelectExtra'),
        saveErrorMsg: (placeholder: string) => {
          return t('UserPermissionGrid.modal.saveErrorMsg', {
            referenceIds: placeholder
          });
        }
      }}
      {...passThroughProps}
    />
  );
};

export default UserPermissionGrid;
