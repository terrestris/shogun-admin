import './ImageFileTable.less';

import React, { useCallback, useEffect, useState } from 'react';

import {
  DeleteOutlined,
  SyncOutlined
} from '@ant-design/icons';

import {
  Modal,
  notification,
  Table,
  TableProps,
  Tooltip
} from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import _isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import config from 'shogunApplicationConfig';

import logger from '@terrestris/base-util/dist/Logger';
import ImageFile from '@terrestris/shogun-util/dist/model/ImageFile';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import TableUtil from '../../../Util/TableUtil';

interface OwnProps { }

type ImageFileTableProps = OwnProps & Partial<TableProps<ImageFile>>;

export const ImageFileTable: React.FC<ImageFileTableProps> = ({
  ...passThroughProps
}) => {

  const [entities, setEntities] = useState<ImageFile[]>();
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();
  const [pageTotal, setPageTotal] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(config.defaultPageSize || 10);
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  const [sortField, setSortField] = useState<string>();
  const [sortOrder, setSortOrder] = useState<SortOrder>();

  const navigate = useNavigate();
  const client = useSHOGunAPIClient();
  const service = client?.imagefile();
  const {
    t,
    i18n
  } = useTranslation();

  const columns: any = [{
    title: 'UUID',
    key: 'fileUuid',
    dataIndex: 'fileUuid',
    sorter: TableUtil.getSorter('fileUuid'),
    ...TableUtil.getColumnSearchProps('fileUuid')
  }, {
    title: 'Name',
    key: 'fileName',
    dataIndex: 'fileName',
    sorter: TableUtil.getSorter('fileName'),
    defaultSortOrder: 'ascend',
    ...TableUtil.getColumnSearchProps('fileName')
  }, {
    title: 'Created',
    key: 'created',
    dataIndex: 'created',
    sorter: TableUtil.getSorter('created'),
    defaultSortOrder: 'descend',
    render: (val: string) => new Date(val).toLocaleString(i18n.language),
    ...TableUtil.getColumnSearchProps('created')
  }];

  const onRowClick = (imageFile: ImageFile) => {
    navigate(`${config.appPrefix}/portal/imagefile/${imageFile.id}`);
  };

  const name = {
    singular: t('ImageFileTable.imageSingular'),
    plural: t('ImageFileTable.imagePlural')
  };

  const fetchEntities = useCallback(async () => {
    setLoadingState('loading');
    try {
      const fetchedEntities = await service?.findAll({
        page: pageCurrent - 1,
        size: pageSize,
        sort: {
          properties: _isNil(sortField) ? [] : [sortField],
          order: sortOrder === 'ascend' ? 'asc' : sortOrder === 'descend' ? 'desc' : undefined
        }
      });
      setPageTotal(fetchedEntities?.totalElements);
      setEntities(fetchedEntities?.content);
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
      logger.error(`Could not fetch images due to the following error: ${error}`);
    }
  }, [service, pageCurrent, pageSize, sortField, sortOrder]);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  const onDeleteClick = (record: ImageFile) => {
    if (!record.id) {
      setEntities(entities?.filter(r => r !== record));
      return;
    }

    Modal.confirm({
      cancelText: t('ImageFileTable.cancel'),
      title: t('ImageFileTable.delete', { entity: name.singular}),
      content: (
        <div>
          <div>{t('ImageFileTable.confirmInfo', { entity: name.singular })}</div>
          <br />
          <div>{t('ImageFileTable.conFirmTooltip', { entity: name.singular })}</div>
        </div>
      ),
      onOk: async () => {
        try {
          if (!_isNil(record.fileUuid)) {
            await service?.delete(record.fileUuid);

            notification.info({
              message: t('ImageFileTable.deletionInfo', { entity: name.singular }),
              description: t('ImageFileTable.deletionInfo', {
                entity: name.singular,
                record: record.fileName
              })
            });

            await fetchEntities();
            navigate(`${config.appPrefix}/portal/imagefile`);
          }
        } catch (error) {
          notification.error({
            message: t('ImageFileTable.deleteFail'),
            description: t('ImageFileTable.deleteFailDescript', { record: record.fileName })
          });
          logger.error(`Could not delete image entities due to the following error: ${error}`);
        }
      }
    });
  };

  const tableColumns = [
    ...columns,
    {
      title: (
        <Tooltip title={t('ImageFileTable.reloadTooltip')}>
          <SyncOutlined
            onClick={fetchEntities}
          />
        </Tooltip>
      ),
      className: 'operation-column',
      width: 100,
      dataIndex: 'operation',
      render: (_: any, record: ImageFile) => (
        <div className="actions">
          <Tooltip title="Löschen">
            <DeleteOutlined onClick={() => onDeleteClick(record)} />
          </Tooltip>
        </div>
      )
    }
  ];

  const onTableChange: TableProps<ImageFile>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    if (!Array.isArray(sorter)) {
      setSortOrder(sorter.order);
      setSortField(sorter.field as string);
    }

    if (!_isNil(pagination.current)) {
      setPageCurrent(pagination.current);
    }
    if (!_isNil(pagination.pageSize)) {
      setPageSize(pagination.pageSize);
    }
  };

  if (!entities) {
    return <></>;
  }

  return (
    <Table
      className="imagefile-table"
      columns={tableColumns}
      rowKey={(record) => `${record?.id}`}
      rowClassName={() => 'editable-row'}
      dataSource={entities}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record)
        };
      }}
      bordered
      size="small"
      loading={loadingState === 'loading'}
      onChange={onTableChange}
      pagination={{
        total: pageTotal,
        current: pageCurrent,
        pageSize: pageSize,
        showTotal: total => `${t('GeneralEntityTable.paging.total')}: ${total}`,
        showSizeChanger: true,
        showQuickJumper: true,
        locale: {
          // eslint-disable-next-line camelcase
          next_page: t('GeneralEntityTable.paging.nextPage'),
          // eslint-disable-next-line camelcase
          prev_page: t('GeneralEntityTable.paging.prevPage'),
          // eslint-disable-next-line camelcase
          items_per_page: `/ ${t('GeneralEntityTable.paging.itemsPerPage')}`,
          // eslint-disable-next-line camelcase
          jump_to: t('GeneralEntityTable.paging.jumpTo'),
          page: t('GeneralEntityTable.paging.page'),
        }
      }}
      {...passThroughProps}
    />
  );
};

export default ImageFileTable;
