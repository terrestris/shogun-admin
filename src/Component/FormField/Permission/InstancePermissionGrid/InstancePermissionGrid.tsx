import React, {
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';

import {
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';

import {
  Button,
  Input,
  InputRef,
  message,
  Space,
  Table,
  Tooltip
} from 'antd';
import type {
  ColumnsType,
  ColumnType,
  TableProps
} from 'antd/es/table';
import Logger from 'js-logger';
import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import {
  useTranslation
} from 'react-i18next';

import PermissionCollectionType from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import Group from '@terrestris/shogun-util/dist/model/Group';
import InstancePermission from '@terrestris/shogun-util/dist/model/security/InstancePermission';
import User from '@terrestris/shogun-util/dist/model/User';

import useSHOGunAPIClient from '../../../../Hooks/useSHOGunAPIClient';
import PermissionModal, {
  PermissionModalProps
} from '../PermissionModal/PermissionModal';
import PermissionSelect from '../PermissionSelect/PermissionSelect';

import './InstancePermissionGrid.less';

export interface DataType<T = User | Group> {
  key: number;
  reference: T;
  name: string;
  permission: PermissionCollectionType;
}

export interface InstancePermissionGridProps extends TableProps<DataType> {
  entityType: string;
  entityId: number;
  getInstancePermissions: (entityId: number) => Promise<InstancePermission[]>;
  setInstancePermission: (entityId: number, referenceId: number, permission: PermissionCollectionType) => Promise<void>;
  deleteInstancePermission: (entityId: number, referenceId: number) => Promise<void>;
  toDataType: (permission: InstancePermission) => DataType;
  nameColumnDefinition: ColumnType<DataType>;
  modalProps: Omit<PermissionModalProps, 'entityId' | 'entityType'>;
};

const InstancePermissionGrid: React.FC<InstancePermissionGridProps> = ({
  entityType,
  entityId,
  getInstancePermissions,
  setInstancePermission,
  deleteInstancePermission,
  toDataType,
  modalProps,
  nameColumnDefinition,
  ...passThroughProps
}) => {
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissions, setPermissions] = useState<InstancePermission[]>([]);
  const [data, setData] = useState<DataType[]>([]);

  const searchInput = useRef<InputRef>(null);

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  const getPermissions = useCallback(async () => {
    setPermissionsLoading(true);

    if (!Number.isFinite(entityId)) {
      return;
    }

    try {
      setPermissions(await getInstancePermissions(entityId));
    } catch (error) {
      message.error(t('InstancePermissionGrid.loadErrorMsg'));
      Logger.error(error);
    } finally {
      setPermissionsLoading(false);
    }
  }, [entityId, getInstancePermissions, t]);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  useEffect(() => {
    if (client && Array.isArray(permissions)) {
      setData(permissions.map(toDataType));
    }
  }, [client, permissions, toDataType]);

  const getColumnSearchProps = (dataIndex: string): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        className="column-search"
      >
        <Input
          ref={searchInput}
          placeholder={t('InstancePermissionGrid.filterInputPlaceholder')}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
          >
            {t('InstancePermissionGrid.filterSearchButtonText')}
          </Button>
          <Button
            onClick={() => {
              if (_isFunction(clearFilters)) {
                clearFilters();
              }
              confirm();
            }}
            size="small"
          >
            {t('InstancePermissionGrid.filterResetButtonText')}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) => {
      const val = _get(record, dataIndex);
      if (_isNil(val)) {
        return false;
      }
      return val
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    }
  });

  const onPermissionSelect = async (permission: PermissionCollectionType, record: DataType) => {
    setPermissionsLoading(true);

    try {
      setInstancePermission(entityId, record.reference?.id, permission);

      let dataClone = _cloneDeep(data);

      let match = dataClone.find(entry => entry.reference?.id === record.reference?.id);
      match.permission = permission;

      setData(dataClone);
    } catch (error) {
      message.error(t('InstancePermissionGrid.updateErrorMsg'));
      Logger.error(error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const onDeleteClick = async (record: DataType) => {
    setPermissionsLoading(true);

    try {
      deleteInstancePermission(entityId, record.reference?.id);

      let dataClone = data.filter(entry => entry.reference?.id !== record.reference?.id);

      setData(dataClone);
    } catch (error) {
      message.error(t('InstancePermissionGrid.deleteErrorMsg'));
      Logger.error(error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const getNameColumnDef = (): ColumnType<DataType> => {
    return {
      ...{
        title: t('InstancePermissionGrid.nameColumnTitle'),
        dataIndex: 'name',
        key: 'name',
        defaultSortOrder: 'ascend',
      },
      ...getColumnSearchProps('name'),
      ...nameColumnDefinition,
    };
  };

  const columns: ColumnsType<DataType> = [getNameColumnDef(), {
    title: t('InstancePermissionGrid.permissionColumnTitle'),
    dataIndex: 'permission',
    key: 'permission',
    sorter: (a, b) => b.name?.localeCompare(a.name),
    render: (value: any, record: DataType) => (
      <PermissionSelect
        value={record.permission}
        onSelect={(val: PermissionCollectionType) => {
          onPermissionSelect(val, record);
        }}
      />
    )
  }, {
    title: (
      <PermissionModal
        entityType={entityType}
        entityId={entityId}
        onSave={getPermissions}
        {...modalProps}
      />
    ),
    key: 'operation',
    className: 'operation-column',
    width: 100,
    fixed: 'right',
    render: (value: any, record: DataType) => {
      return (
        <Tooltip
          title={t('InstancePermissionGrid.deletePermissionButtonTooltip')}
        >
          <DeleteOutlined
            onClick={() => onDeleteClick(record)}
          />
        </Tooltip>
      );
    },
  }];

  return (
    <Table
      className='instance-permission-grid'
      loading={permissionsLoading}
      columns={columns}
      dataSource={data}
      {
        ...passThroughProps
      }
    />
  );
};

export default InstancePermissionGrid;
