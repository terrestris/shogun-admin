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

  const onRowClick = (imageFile: ImageFile) => {
    history.push(`${config.appPrefix}/portal/imagefile/${imageFile.fileUuid}`);
  };

  const [entities, setEntities] = useState<ImageFile[]>();
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();

  const name = {
    singular: 'Bilddatei',
    plural: 'Bilddateien'
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
      cancelText: 'Abbrechen',
      title: `${name.singular} löschen`,
      content: (
        <div>
          <div>Die {name.singular} wird gelöscht!</div>
          <br />
          <div>Möchten Sie die Datei {record.fileName} wirklich löschen?</div>
        </div>
      ),
      onOk: async () => {
        try {
          await service?.delete(record.fileUuid);

          notification.info({
            message: `${name.singular} gelöscht`,
            description: `${name.singular} "${record.fileName}" wurde gelöscht`
          });

          fetchEntities();

          history.push(`${config.appPrefix}/portal/imagefile`);
        } catch (error) {
          notification.error({
            message: 'Löschen fehlgeschlagen',
            description: `Die Datei "${record.fileName}" konnte nicht gelöscht werden!`
          });
        }
      }
    });
  };

  const tableColumns = [
    ...columns,
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
