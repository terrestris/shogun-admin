import React, { useMemo } from 'react';

import { useHistory } from 'react-router-dom';

import {
  Table,
  Input,
  Modal,
  notification,
  Tooltip
} from 'antd';
import {
  ColumnType,
  TableProps
} from 'antd/lib/table';
import { SortOrder } from 'antd/lib/table/interface';

import {
  DeleteOutlined,
  SyncOutlined
} from '@ant-design/icons';

import _isEmpty from 'lodash/isEmpty';

import Logger from 'js-logger';

import BaseEntity from '../../../Model/BaseEntity';

import { GenericEntityController } from '../../../Controller/GenericEntityController';

import DisplayField from '../../FormField/DisplayField/DisplayField';
import LinkField from '../../FormField/LinkField/LinkField';

import TableUtil from '../../../Util/TableUtil';

import config from 'shogunApplicationConfig';

import './GeneralEntityTable.less';

export type TableConfig<T extends BaseEntity> = {
  columnDefinition?: GeneralEntityTableColumn<T>[];
  dataMapping?: DataMapping;
};

type DataMapping = {
  [dataIndex: string]: {
    [key: string]: string;
  };
};

type FilterConfig = {
  isFilterable: boolean;
};

type SortConfig = {
  customSorterName?: string;
  isSortable: boolean;
  sortOrder?: SortOrder;
};

export type EntityTableAction = 'delete' | 'edit';

type GeneralEntityTableColumnType = {
  cellRenderComponentName?: string;
  cellRenderComponentProps?: {
    [key: string]: any;
  };
  filterConfig?: FilterConfig; // if available: property is filterable by corresponding property using default config
  sortConfig?: SortConfig; // if available: property is sortable by corresponding property using default config
};

export type GeneralEntityTableColumn<T extends BaseEntity> = ColumnType<T> & GeneralEntityTableColumnType;

type OwnProps<T extends BaseEntity> = {
  controller: GenericEntityController<T>;
  entities: T[];
  actions?: EntityTableAction[];
  entityType: string;
  fetchEntities?: () => void;
  onRowClick?: (record: T, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  tableConfig: TableConfig<T>;
};

type GeneralEntityTableProps<T extends BaseEntity> = OwnProps<T> & TableProps<T> & React.HTMLAttributes<HTMLDivElement>;

export function GeneralEntityTable<T extends BaseEntity>({
  controller,
  entities,
  entityType,
  fetchEntities = () => undefined,
  actions = ['delete'],
  tableConfig,
  ...tablePassThroughProps
}: GeneralEntityTableProps<T>) {

  const routePath = useMemo(() => `${config.appPrefix}/portal/${entityType}`, [entityType]);
  const hist = useHistory();

  const onRowClick = (record: T) => hist.push(`${routePath}/${record.id}`);

  const onDeleteClick = async (record: T) => {

    const entityId = record?.id;

    if (!entityId) {
      fetchEntities();
      return;
    }

    let entityName = (record as any).name || (record as any).title;

    if (!entityName) {
      entityName = entityId;
    }

    let confirmName: string;
    Modal.confirm({
      cancelText: 'Abbrechen',
      title: 'Entität löschen',
      content: (
        <div>
          <div>{`Die Entität "${entityName}" wird gelöscht!`}</div>
          <br />
          <div>Bitte geben sie zum Bestätigen den Namen ein:</div>
          <Input onChange={(e) => { confirmName = e.target.value; }} />
        </div>
      ),
      onOk: async () => {
        if (confirmName === entityName) {
          try {
            await controller?.delete(record);
            notification.info({
              message: 'Löschen erfolgreich',
              description: `Die Entität "${entityName}" wurde gelöscht!`
            });
            fetchEntities();
          } catch (error) {
            notification.error({
              message: 'Löschen fehlgeschlagen',
              description: `Die Entität "${entityName}" konnte nicht gelöscht werden!`
            });
            Logger.error(error);
          }
        }
      }
    });
  };

  const getRenderer = (cellRendererName: string, cellRenderComponentProps: {[key: string]: any},
    mapping?: {[key: string]: string}) => (value: any) => {
    const displayValue = mapping ? mapping[value] : value;

    if (cellRendererName === 'JSONCell') {
      return (
        <DisplayField
          value={displayValue}
          format="json"
          {...cellRenderComponentProps}
        />
      );
    }

    if (cellRendererName === 'DateCell') {
      return (
        <DisplayField
          value={displayValue}
          format="date"
          {...cellRenderComponentProps}
        />);
    }

    if (cellRendererName === 'LinkCell') {
      return (
        <LinkField
          value={displayValue}
          {...cellRenderComponentProps}
        />
      );
    }

    return <>{displayValue}</>;
  };

  const getTableColumns = (): ColumnType<T>[] => {
    let cols: GeneralEntityTableColumn<T>[];
    if (_isEmpty(tableConfig?.columnDefinition)) {
      cols = [{
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        sorter: TableUtil.getSorter('id'),
        defaultSortOrder: 'ascend'
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: TableUtil.getSorter('name'),
        defaultSortOrder: 'ascend',
        ...TableUtil.getColumnSearchProps('name')
      } as any];
    } else {
      // check for preconfigured sorters, filters and custom components (TODO)
      cols = tableConfig?.columnDefinition.map(cfg => {
        const {
          sortConfig,
          filterConfig,
          cellRenderComponentName,
          cellRenderComponentProps
        } = cfg;

        let columnDef: ColumnType<T> = cfg as ColumnType<T>;
        if (!_isEmpty(sortConfig) && sortConfig.isSortable) {
          columnDef = {
            ...columnDef,
            sorter: TableUtil.getSorter(cfg.dataIndex.toString()),
            defaultSortOrder: sortConfig.sortOrder || 'ascend'
          };
        }
        if (!_isEmpty(filterConfig) && filterConfig.isFilterable) {
          columnDef = {
            ...columnDef,
            ...TableUtil.getColumnSearchProps(cfg.dataIndex.toString())
          } as any;
        }
        const mapping = tableConfig.dataMapping?.[cfg.dataIndex.toString()];
        if (!_isEmpty(cellRenderComponentName) || !_isEmpty(mapping)) {
          columnDef = {
            ...columnDef,
            render: getRenderer(cellRenderComponentName, cellRenderComponentProps, mapping)
          };
        }

        return columnDef;
      });
    }

    return [
      ...cols,
      {
        title: (
          <Tooltip title="Neu laden">
            <SyncOutlined
              onClick={fetchEntities}
            />
          </Tooltip>
        ),
        className: 'operation-column',
        width: 100,
        dataIndex: 'operation',
        key: 'operation',
        render: (_: any, record: T) => {
          return (
            <div className="actions">
              {
                actions.includes('delete') &&
                <Tooltip title="Löschen">
                  <DeleteOutlined onClick={() => onDeleteClick(record)} />
                </Tooltip>
              }
            </div>
          );
        }
      }
    ];
  };

  return (
    <Table
      className="general-entity-table"
      columns={getTableColumns()}
      dataSource={entities}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record)
        };
      }}
      pagination={false}
      {...tablePassThroughProps}
    />
  );
};

export default GeneralEntityTable;
