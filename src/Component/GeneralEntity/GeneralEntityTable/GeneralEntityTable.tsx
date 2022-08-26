import React, { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

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

import {
  useTranslation
} from 'react-i18next';

import _isEmpty from 'lodash/isEmpty';

import Logger from 'js-logger';

import BaseEntity from '@terrestris/shogun-util/dist/model/BaseEntity';

import { GenericEntityController } from '../../../Controller/GenericEntityController';

import DisplayField from '../../FormField/DisplayField/DisplayField';
import LinkField from '../../FormField/LinkField/LinkField';

import TableUtil from '../../../Util/TableUtil';

import config from 'shogunApplicationConfig';

import './GeneralEntityTable.less';

import TranslationUtil from '../../../Util/TranslationUtil';

import _cloneDeep from 'lodash/cloneDeep';

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
  i18n: FormTranslations;
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
  i18n,
  controller,
  entities,
  entityType,
  fetchEntities = () => undefined,
  actions = ['delete'],
  tableConfig,
  ...tablePassThroughProps
}: GeneralEntityTableProps<T>) {

  const routePath = useMemo(() => `${config.appPrefix}/portal/${entityType}`, [entityType]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onRowClick = (record: T) => navigate(`${routePath}/${record.id}`);

  const onDeleteClick = async (record: T) => {
    const entityId = record?.id;

    if (!entityId) {
      fetchEntities();
      return;
    }

    let entityName: string | number = (record as any).name || (record as any).title;

    if (!entityName) {
      entityName = entityId;
    }

    let confirmName: string;
    Modal.confirm({
      cancelText: t('GeneralEntityTable.cancelText'),
      title: t('GeneralEntityTable.title'),
      content: (
        <div>
          <div>{t('GeneralEntityTable.contentInfo', { entityName: entityName })}</div>
          <br />
          <div>{t('GeneralEntityTable.contentConfirmInfo')}</div>
          <Input onChange={(e) => { confirmName = e.target.value; }} />
        </div>
      ),
      onOk: async () => {
        let isCheck = typeof entityName === 'string' ?
          confirmName === TranslationUtil.getTranslationFromConfig(entityName, i18n) :
          parseInt(confirmName, 10) === entityName;

        if (isCheck) {
          try {
            await controller?.delete(record);
            notification.info({
              message: t('GeneralEntityTable.deleteConfirm'),
              description: t('GeneralEntityTable.deleteConfirmDescript', { entityName: entityName })
            });
            fetchEntities();
          } catch (error) {
            notification.error({
              message: t('GeneralEntityTable.deleteFail'),
              description: t('GeneralEntityTable.deleteFailDescript', { entityName: entityName })
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
          i18n={i18n}
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
        title: t('GeneralEntityTable.columnId'),
        key: 'id',
        dataIndex: 'id',
        sorter: TableUtil.getSorter('id'),
        defaultSortOrder: 'ascend'
      }, {
        title: t('GeneralEntityTable.columnName'),
        dataIndex: 'name',
        key: 'name',
        sorter: TableUtil.getSorter('name'),
        defaultSortOrder: 'ascend',
        ...TableUtil.getColumnSearchProps('name')
      } as any];
    } else {
      // check for preconfigured sorters, filters and custom components (TODO)
      cols = tableConfig?.columnDefinition.map(cfg => {
        let copyCfg = _cloneDeep(cfg);
        copyCfg.title = TranslationUtil.getTranslationFromConfig(cfg.title as string, i18n);
        const {
          sortConfig,
          filterConfig,
          cellRenderComponentName,
          cellRenderComponentProps
        } = copyCfg;

        let columnDef: ColumnType<T> = copyCfg as ColumnType<T>;
        if (!_isEmpty(sortConfig) && sortConfig.isSortable) {
          columnDef = {
            ...columnDef,
            sorter: TableUtil.getSorter(copyCfg.dataIndex.toString()),
            defaultSortOrder: sortConfig.sortOrder || 'ascend'
          };
        }
        if (!_isEmpty(filterConfig) && filterConfig.isFilterable) {
          columnDef = {
            ...columnDef,
            ...TableUtil.getColumnSearchProps(copyCfg.dataIndex.toString())
          } as any;
        }
        const mapping = tableConfig.dataMapping?.[copyCfg.dataIndex.toString()];
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
          <Tooltip title={t('GeneralEntityTable.tooltipReload')}>
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
                <Tooltip title={t('GeneralEntityTable.tooltipDelete')}>
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
      locale={{
        filterTitle: t('Table.filterTitle'),
        filterConfirm: t('Table.filterConfirm'),
        filterReset: t('Table.filterReset'),
        filterEmptyText: t('Table.filterEmptyText'),
        filterCheckall: t('Table.filterCheckall'),
        filterSearchPlaceholder: t('Table.filterSearchPlaceholder'),
        emptyText: t('Table.emptyText'),
        selectAll: t('Table.selectAll'),
        selectInvert: t('Table.selectInvert'),
        selectNone: t('Table.selectNone'),
        selectionAll: t('Table.selectionAll'),
        sortTitle: t('Table.sortTitle'),
        expand: t('Table.expand'),
        collapse: t('Table.collapse'),
        triggerDesc: t('Table.triggerDesc'),
        triggerAsc: t('Table.triggerAsc'),
        cancelSort: t('Table.cancelSort')
      }}
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
