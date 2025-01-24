import React, {
  useCallback,
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

import { PermissionCollectionType } from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import UserInstancePermission from '@terrestris/shogun-util/dist/model/security/UserInstancePermission';
import User from '@terrestris/shogun-util/dist/model/User';
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
  'nameColumnDefinition' | 'getReferences' | 'toTag' | 'modalProps'> { }

const UserPermissionGrid: React.FC<UserPermissionGridProps> = ({
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

  const getUserInstancePermissions = useCallback(async (id: number) => {
    return await service()?.getUserInstancePermissions(id);
  }, [service]);

  const setUserInstancePermission = useCallback(async (id: number, referenceId: number,
    permission: PermissionCollectionType) => {
    await service()?.setUserInstancePermission(id, referenceId, permission);
  }, [service]);

  const deleteUserInstancePermission = useCallback(async (id: number, referenceId: number) => {
    await service()?.deleteUserInstancePermission(id, referenceId);
  }, [service]);

  const getUsers = useCallback(async (pageOpts?: PageOpts) => {
    return client?.user().findAll(pageOpts);
  }, [client]);

  const modalProps = useMemo(() => ({
    toTag: (user: User) => {
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
    },
    getReferences: getUsers,
    tagRenderer: (props: CustomTagProps) => {
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
          bordered={false}
          {...passProps}
        >
          {label}
        </Tag>
      );
    },
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
  }), [getUsers, setUserInstancePermission, t]);

  const toUserDataType = (permission: UserInstancePermission): DataType<User> => {
    return {
      key: permission.user?.id,
      reference: permission.user,
      name: permission.user?.providerDetails?.username,
      permission: permission.permission?.name
    };
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
      modalProps={modalProps}
      {...passThroughProps}
    />
  );
};

export default UserPermissionGrid;
