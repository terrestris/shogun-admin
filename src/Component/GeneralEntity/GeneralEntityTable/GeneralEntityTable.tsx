import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import TableUtil from '../../../Util/TableUtil';
import _isEmpty from 'lodash/isEmpty';

import config from 'shogunApplicationConfig';
import BaseEntity from '../../../Model/BaseEntity';

import { GenericEntityController } from '../../../Controller/GenericEntityController';
import DisplayField from '../../FormField/DisplayField/DisplayField';
import Table, { ColumnType, TableProps } from 'antd/lib/table';
import { Tooltip } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { SortOrder } from 'antd/lib/table/interface';
import './GeneralEntityTable.less';

export type TableConfig<T extends BaseEntity> = {
  columnDefinition?: GeneralEntityTableColumn<T>[];
};

type FilterConfig = {
  isFilterable: boolean;
};

type SortConfig = {
  customSorterName?: string;
  isSortable: boolean;
  sortOrder?: SortOrder;
};

type GeneralEntityTableColumnType = {
  cellRenderComponentName?: string;
  filterConfig?: FilterConfig; // if available: property is filterable by corresponding property using default config
  sortConfig?: SortConfig; // if available: property is sortable by corresponding property using default config
};

export type GeneralEntityTableColumn<T extends BaseEntity> = ColumnType<T> & GeneralEntityTableColumnType;

type OwnProps<T extends BaseEntity> = {
  controller: GenericEntityController<T>;
  entities: T[];
  entityType: string;
  fetchEntities?: () => void;
  onRowClick?: (record: T, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  tableConfig: TableConfig<T>;
};

type GeneralEntityTableProps<T extends BaseEntity> = OwnProps<T> & TableProps<T> & React.HTMLAttributes<HTMLDivElement>;

export function GeneralEntityTable<T extends BaseEntity> ({
  entities,
  entityType,
  fetchEntities = () => undefined,
  tableConfig,
  ...tablePassThroughProps
}: GeneralEntityTableProps<T>) {

  const routePath = useMemo(() => `${config.appPrefix}/portal/${entityType}`, [entityType]);
  const hist = useHistory();

  const onRowClick = (record: T) => hist.push(`${routePath}/${record.id}`);

  const getRenderer = (cellRendererName: string) => (text) => {
    if (cellRendererName === 'JSONCell') {
      return <DisplayField value={text} format="json"/>;
    }

    if (cellRendererName === 'DateCell') {
      return <DisplayField value={text} format="date"/>;
    }

    return <>{text}</>;
  };

  const tableColumns: ColumnType<T>[] = useMemo(() => {
    let cols = tableConfig?.columnDefinition;
    if (_isEmpty(cols)) {
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
      }];
    } else {
      // check for preconfigured sorters, filters and custom components (TODO)
      cols = tableConfig?.columnDefinition.map(cfg => {

        const {
          sortConfig,
          filterConfig,
          cellRenderComponentName
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
          };
        }
        if (!_isEmpty(cellRenderComponentName)) {
          columnDef = {
            ...columnDef,
            render: getRenderer(cellRenderComponentName)
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
        key: 'operation'
      }
    ];
  }, [fetchEntities, tableConfig?.columnDefinition]);

  return (
    <Table
      className="general-entity-table"
      columns={tableColumns}
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
