import React from 'react';
import { useHistory } from 'react-router-dom';

import { EntityTable, EntityTableProps } from '../../../Component/Table/EntityTable/EntityTable';
import ImageFile from '../../../Model/ImageFile';
import ImageFileService from '../../../Service/ImageFileService/ImageFileService';
import TableUtil from '../../../Util/TableUtil';

import config from 'shogunApplicationConfig';

interface OwnProps { }

type ImageFileTableProps = OwnProps & Omit<EntityTableProps, 'service' | 'routePath' | 'name' | 'columns' >;
const imageFileService = new ImageFileService();

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

export const ImageFileTable: React.FC<ImageFileTableProps> = props => {

  const history = useHistory();
  const onRowClick = (imageFile: ImageFile) => {
    history.push(`${config.appPrefix}/portal/imagefile/${imageFile.fileUuid}`);
  };

  return (
    <EntityTable
      service={imageFileService}
      routePath={`${config.appPrefix}/portal/imagefile`}
      onRowClick={onRowClick}
      name={{
        singular: 'Bilddatei',
        plural: 'Bilddateien'
      }}
      columns={columns}
      // actions={['delete']}
      {...props}
    />
  );
};

export default ImageFileTable;
