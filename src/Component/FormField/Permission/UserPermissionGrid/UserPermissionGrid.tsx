import React, {
  useCallback
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
import UserInstancePermission from '@terrestris/shogun-util/dist/model/security/UserInstancePermission';
import User from '@terrestris/shogun-util/dist/model/User';
import GenericEntityService from '@terrestris/shogun-util/dist/service/GenericEntityService';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';
import UserAvatar from '../../../UserAvatar/UserAvatar';
import InstancePermissionGrid, {
  DataType,
  InstancePermissionGridProps
} from '../InstancePermissionGrid/InstancePermissionGrid';

import './UserPermissionGrid.less';

export interface UserPermissionGridProps extends Omit<InstancePermissionGridProps<UserInstancePermission>,
  'getInstancePermissions' | 'setInstancePermission' | 'deleteInstancePermission' | 'toDataType' |
  'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { };

const UserPermissionGrid: React.FC<UserPermissionGridProps> = ({
  entityType,
  ...passThroughProps
}) => {

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  const service = useCallback(() => {
    return (client?.[entityType] as () => GenericEntityService<BaseEntity>)();
  }, [client, entityType]);

  const getUserInstancePermissions = async (id: number) => {
    return await service()?.getUserInstancePermissions(id);
  };

  const setUserInstancePermission = async (id: number, referenceId: number, permission: PermissionCollectionType) => {
    await service()?.setUserInstancePermission(id, referenceId, permission);
  };

  const deleteUserInstancePermission = async (id: number, referenceId: number) => {
    await service()?.deleteUserInstancePermission(id, referenceId);
  };

  const getUsers = async (pageOpts?: PageOpts) => {
    return await client?.user().findAll(pageOpts);
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
        const aName = a.reference?.providerDetails?.username;
        const bName = b.reference?.providerDetails?.username;

        if (!aName || !bName) {
          return 0;
        }

        return aName.localeCompare(bName);
      },
      render: (_: any, record: DataType<User>) => (
        <UserAvatar
          user={record.reference}
        />
      )
    };
  };

  return (
    <InstancePermissionGrid
      entityType={entityType}
      getInstancePermissions={getUserInstancePermissions}
      setInstancePermission={setUserInstancePermission}
      deleteInstancePermission={deleteUserInstancePermission}
      toDataType={toUserDataType}
      nameColumnDefinition={colDefinition()}
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
