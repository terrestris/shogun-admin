import React from 'react';
import { Divider, Modal, Table, Typography, Button, message,Space } from 'antd';
import { useTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import { ColumnsType } from 'antd/lib/table';

import {
  GroupedInformationModalTableDataType,
  InformationModalTableDataType
} from './types';
import {
  exampleConfig as AppLayerConfigExample
} from './information/application/LayerConfigInformation';
import {
  exampleConfig as AppClientConfigExample
} from './information/application/ClientConfigInformation';
import {
  exampleConfig as AppLayerTreeExample
} from './information/application/LayerTreeInformation';
import {
  exampleConfig as AppToolConfigExample
} from './information/application/ToolConfigInformation';
import {
  exampleConfig as LayerClientConfigExample
} from './information/layer/ClientConfigInformation';
import {
  exampleConfig as LayerSourceConfigExample
} from './information/layer/SourceConfigInformation';
import {
  exampleConfig as LayerFeaturesExample
} from './information/layer/FeaturesInformation';
import {
  exampleConfig as UserProviderDetailsExample
} from './information/user/ProviderDetailsInformation';
import {
  exampleConfig as UserDetailsExample
} from './information/user/DetailsInformation';
import {
  exampleConfig as UserClientConfigExample
} from './information/user/ClientConfigInformation';
import { JSONSchema7 } from 'json-schema';
import { getDocDataforTable, getDocDescription } from './information/helpers';
import { CopyOutlined } from '@ant-design/icons';

import './InformationModal.less';

interface InformationModalProps {
  dataField?: string;
  entity?: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  schema: JSONSchema7;
}

export const InformationModal: React.FC<InformationModalProps> = ({
  dataField = '',
  entity = '',
  isModalOpen = false,
  setIsModalOpen,
  schema = undefined
}) => {

  const tmpFlat = [];

  const docTableColums = (idCode: string): ColumnsType  => [
    {
      title: 'Property Name',
      dataIndex: 'propertyName',
      key: 'propertyName' + idCode
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description' + idCode
    },
    {
      title: 'Example',
      dataIndex: 'example',
      key: 'example'  + idCode
    },
    {
      title: 'Data type',
      dataIndex: 'dataType',
      key: 'dataType' + idCode
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required' + idCode
    },
  ];

  const getTitle = () => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return t('InformationModal.title.application.clientConfig');
      case 'application-layerTree':
        return t('InformationModal.title.application.layerTree');
      case 'application-layerConfig':
        return t('InformationModal.title.application.layerConfig');
      case 'application-toolConfig':
        return t('InformationModal.title.application.toolConfig');

      case 'layer-clientConfig':
        return t('InformationModal.title.layer.clientConfig');
      case 'layer-sourceConfig':
        return t('InformationModal.title.layer.sourceConfig');
      case 'layer-features':
        return t('InformationModal.title.layer.features');

      case 'user-details':
        return t('InformationModal.title.user.details');
      case 'user-clientConfig':
        return t('InformationModal.title.user.clientConfig');
      case 'user-providerDetails':
        return t('InformationModal.title.user.providerDetails');

      default:
        return [{
          propertyName: 'TODO',
          description: 'TODO',
          example: 'TODO',
          dataType: 'TODO',
          required: 'TODO',
          keyId: String(Math.random())
        }];
    }
  };

  const getDescription = () => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return getDocDescription(schema, 'Application', 'clientConfig');
      case 'application-layerTree':
        return getDocDescription(schema, 'Application', 'layerTree');
      case 'application-layerConfig':
        return getDocDescription(schema, 'Application', 'layerConfig');
      case 'application-toolConfig':
        return getDocDescription(schema, 'Application', 'toolConfig');

      case 'layer-clientConfig':
        return getDocDescription(schema, 'Layer', 'clientConfig');
      case 'layer-sourceConfig':
        return getDocDescription(schema, 'Layer', 'sourceConfig');
      case 'layer-features':
        return getDocDescription(schema, 'Layer', 'features');

      case 'user-providerDetails':
        return getDocDescription(schema, 'User', 'providerDetails');
      case 'user-details':
        return getDocDescription(schema, 'User', 'details');
      case 'user-clientConfig':
        return getDocDescription(schema, 'User', 'clientConfig');

      default:
        return 'TODO';
    }
  };

  const getTableData = () => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return getDocDataforTable(schema, 'DefaultApplicationClientConfig');
      case 'application-layerTree':
        return getDocDataforTable(schema, 'DefaultLayerTree');
      case 'application-layerConfig':
        return getDocDataforTable(schema, 'DefaultApplicationLayerConfig');
      case 'application-toolConfig':
        return getDocDataforTable(schema, 'DefaultApplicationToolConfig');

      case 'layer-clientConfig':
        return getDocDataforTable(schema, 'DefaultLayerClientConfig');
      case 'layer-sourceConfig':
        return getDocDataforTable(schema, 'DefaultLayerSourceConfig');
      case 'layer-features':
        return undefined;

      case 'user-details':
        return undefined;
      case 'user-clientConfig':
        return undefined;
      case 'user-providerDetails':
        return undefined;

      default:
        return [{
          propertyName: 'TODO',
          description: 'TODO',
          example: 'TODO',
          dataType: 'TODO',
          required: 'TODO',
          keyId: String(Math.random())
        }];
    }
  };

  const getExample = (): string => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return AppClientConfigExample;
      case 'application-layerTree':
        return AppLayerTreeExample;
      case 'application-layerConfig':
        return AppLayerConfigExample;
      case 'application-toolConfig':
        return AppToolConfigExample;

      case 'layer-clientConfig':
        return LayerClientConfigExample;
      case 'layer-sourceConfig':
        return LayerSourceConfigExample;
      case 'layer-features':
        return LayerFeaturesExample;

      case 'user-providerDetails':
        return UserProviderDetailsExample;
      case 'user-details':
        return UserDetailsExample;
      case 'user-clientConfig':
        return UserClientConfigExample;

      default:
        return `{
          Example: 'TODO'
        }`;
    }
  };

  const {
    t
  } = useTranslation();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * @description A method to group the documentation data to make it ready to fit the Table data requirements
   * @param data InformationModalTableDataType[]
   * @param parentName string
   * @returns GroupedInformationModalTableDataType
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
   * @description A method to read the given table data while also grabing the subProps of a property
   * in a recursive way.
   * @param data InformationModalTableDataType[]
   * @param parentName string
   * @returns InformationModalTableDataType[]
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

  const copyExample = () => {
    var copiedText: HTMLElement = document.getElementById('json-example');
    navigator.clipboard.writeText(copiedText.innerHTML);
    message.info(t('InformationModal.copiedToClipboard'));
  };

  // The data to use for the table
  const documentTableData = !!getTableData() && groupDocumentationData(getTableData(), dataField);

  return (
    <Modal
      key={`modal-for-${entity}-${dataField}`}
      className='information-modal'
      width='95vw'
      visible={isModalOpen}
      title={(
        <Title
          level={2}
          key={`title-for-${entity}-${dataField}`}
        >
          {`${getTitle()} ${t('InformationModal.titlePredicate')}`}
        </Title>
      )}
      onCancel={handleCancel}
      mask={false}
      destroyOnClose={true}
      cancelText={t('InformationModal.closeButtonText')}
      okButtonProps={{ hidden: true }}
    >
      <Typography key={`description-for-${entity}-${dataField}`}>
        <Typography.Paragraph>
          {getDescription()}
        </Typography.Paragraph>
      </Typography>
      <Divider />
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {documentTableData && Object.keys(documentTableData).map((key, index) => {
          return (
            <div key={`table-for-${entity}-${dataField}-${key}-${index}`}>
              <Title
                level={4}
                key={`table-title-for-${entity}-${dataField}-${key}-${index}`}
              >
                {key}
              </Title>
              <Table
                columns={docTableColums(`${dataField}-${key}-${index}`)}
                dataSource={documentTableData[key]}
                pagination={false}
                key={`table-information-for-${entity}-${dataField}-${key}-${index}`}
              />
            </div>
          );
        })}
      </Space>
      <Divider />
      <Title level={3}> Example </Title>
      <pre>
        <Button
          onClick={copyExample}
          icon={<CopyOutlined />}
          className='information-modal-copy-example-button'
        />
        <code id='json-example'>
          {getExample()}
        </code>
      </pre>
    </Modal>
  );
};

export default InformationModal;
