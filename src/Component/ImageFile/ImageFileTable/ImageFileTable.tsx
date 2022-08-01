import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { Modal, notification, Tooltip, Table, TableProps } from 'antd';

import {
  DeleteOutlined,
  SyncOutlined
} from '@ant-design/icons';

import ImageFile from '@terrestris/shogun-util/dist/model/ImageFile';

import TableUtil from '../../../Util/TableUtil';
import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';

import config from 'shogunApplicationConfig';

import { useTranslation } from 'react-i18next';

import './ImageFileTable.less';

interface OwnProps { }

type ImageFileTableProps = OwnProps & Partial<TableProps<ImageFile>>;

const columns: any = [
  {
    title: 'UUID',
    key: 'fileUuid',
    dataIndex: 'fileUuid',
    sorter: TableUtil.getSorter('fileUuid'),
    editable: true,
    ...TableUtil.getColumnSearchProps('fileUuid')
  },
  {
    title: 'Name',
    key: 'fileName',
    dataIndex: 'fileName',
    sorter: TableUtil.getSorter('fileName'),
    defaultSortOrder: 'ascend',
    editable: true,
    ...TableUtil.getColumnSearchProps('fileName')
  }
];

export const ImageFileTable: React.FC<ImageFileTableProps> = ({
  ...passThroughProps
}) => {

  const history = useHistory();
  const client = useSHOGunAPIClient();
  const service = client.imagefile();

  const {
    t
  } = useTranslation();

  const onRowClick = (imageFile: ImageFile) => {
    history.push(`${config.appPrefix}/portal/imagefile/${imageFile.fileUuid}`);
  };

  const [entities, setEntities] = useState<ImageFile[]>();
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();

  const name = {
    singular: t('ImageFileTable.imageSingular'),
    plural: t('ImageFileTable.imagePlural')
  };

  const fetchEntities = async () => {
    setLoadingState('loading');
    try {
      const fetchedEntities = await service?.findAll();
      setEntities(fetchedEntities);
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
    }
  };

  if (!loadingState && !entities) {
    fetchEntities();
  }

  const onDeleteClick = (record: ImageFile) => {
    if (!record.id) {
      setEntities(entities.filter(r => r !== record));
      return;
    }

    Modal.confirm({
      cancelText: t('ImageFileTable.cancel'),
      title: t('ImageFileTable.delete', { entity: name.singular}),
      content: (
        <div>
          <div>{t('ImageFileTable.confirmInfo', { entity: name.singular})}</div>
          <br />
          <div>{t('ImageFileTable.conFirmTooltip', { entity: name.singular})}</div>
        </div>
      ),
      onOk: async () => {
        try {
          await service?.delete(record.fileUuid);

          notification.info({
            message: t('ImageFileTable.deletionInfo', { entity: name.singular}),
            description: t('ImageFileTable.deletionInfo', { entity: name.singular, record: record.fileName })
          });

          fetchEntities();

          history.push(`${config.appPrefix}/portal/imagefile`);
        } catch (error) {
          notification.error({
            message: t('ImageFileTable.deleteFail'),
            description: t('ImageFileTable.deleteFailDescript', { record: record.fileName })
          });
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

  if (!entities) {
    return <></>;
  }

  return (
    <Table
      className="imagefile-table"
      columns={tableColumns}
      rowKey={(record)=> record.id.toString()}
      rowClassName={() => 'editable-row'}
      dataSource={entities}
      pagination={false}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record)
        };
      }}
      bordered
      size="small"
      {...passThroughProps}
    />
  );
};

export default ImageFileTable;
