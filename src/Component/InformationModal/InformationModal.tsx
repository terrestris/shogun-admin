import React from 'react';
import { Modal, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import { ColumnsType } from 'antd/lib/table';
import { 
  GroupedInformationModalTableDataType,
  InformationModalTableDataType
} from './types';
import { LayerConfigurationDocTableData } from './LayerConfigInformation';
import { ClientConfigDocTableData } from './ClientConfigInformation';
import { LayerTreeDocTableData } from './LayerTreeInformation';
import { ToolConfigDocTableData } from './ToolConfigInformation';

interface InformationModalProps {
  infoFor?: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}


export const InformationModal: React.FC<InformationModalProps> = ({
  infoFor = '',
  isModalOpen = false,
  setIsModalOpen,
}) => {
  const tmpFlat = [];

  const docTableColums: ColumnsType  = [
    {
      title: 'Property Name',
      dataIndex: 'propertyName',
      key: 'propertyName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Example',
      dataIndex: 'example',
      key: 'example',
    },
    {
      title: 'Data type',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required',
    },
  ];

  const getTableData = () => {
    switch (infoFor) {
      case 'clientConfig':
        return ClientConfigDocTableData;
      case 'layerTree':
        return LayerTreeDocTableData;
      case 'layerConfig':
        return LayerConfigurationDocTableData;
      case 'toolConfig':
        return ToolConfigDocTableData;
      default:
        return [{
          propertyName: 'propertyName',
          description: 'description',
          example: 'example',
          dataType: 'dataType',
          mandatory: 'mandatory',
        }];
    }
  };

  const {
    t
  } = useTranslation();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * @description This method grabs the struture
   * @param data The array containing the json with the structure to present the data
   * @param parentName The name of the parent node
   * @returns
   */
  const groupDocumentationData = (
    data: InformationModalTableDataType[],
    parentName: string
  ): GroupedInformationModalTableDataType => {
    const flatDocData = docParser(data, parentName);
    const groupedData = flatDocData.reduce((acc, obj) => {
      const key = obj['parent'];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
    return groupedData;
  };

  /**
   * An helper function
   * @param data
   * @param parentName
   * @returns
   */
  const docParser = (
    data: InformationModalTableDataType[],
    parentName: string
  ): InformationModalTableDataType[] => {
    data.forEach((d: InformationModalTableDataType) => {
      if (d.subProps) {
        tmpFlat.push({
          ...d,
          parent: parentName
        });
        return docParser(d.subProps, d.propertyName);
      }
      tmpFlat.push({
        ...d,
        parent: parentName
      });
      return '';
    });

    return tmpFlat;
  };

  const documentTableData = groupDocumentationData(getTableData(), infoFor);

  return (
    <Modal
      width='95vw'
      visible={isModalOpen}
      title={(
        <Title level={2}>
          {`${infoFor} ${t('InformationModal.titlePredicate')}`}
        </Title>
      )}
      onCancel={handleCancel}
      mask={false}
      destroyOnClose={true}
      cancelText={t('InformationModal.closeButtonText')}
      okButtonProps={{ hidden: true }}
    >
      {Object.keys(documentTableData).map(key => {
        return (
          <>
            <Title level={3}>{key}</Title>
            <Table
              columns={docTableColums}
              dataSource={documentTableData[key]}
              pagination={false}
            />
          </>
        );
      })}
    </Modal>
  );
};

export default InformationModal;

