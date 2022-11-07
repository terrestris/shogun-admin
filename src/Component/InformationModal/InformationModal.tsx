import React from 'react';
import { Divider, Modal, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import { ColumnsType } from 'antd/lib/table';
import {
  GroupedInformationModalTableDataType,
  InformationModalTableDataType
} from './types';
import {
  exampleConfig as AppLayerConfigExample,
  description as AppLayerConfigDescription
} from './information/application/LayerConfigInformation';
import {
  exampleConfig as AppClientConfigExample,
  description as AppClientConfigDescription
} from './information/application/ClientConfigInformation';
import {
  exampleConfig as AppLayerTreeExample,
  description as AppLayerTreeDescription
} from './information/application/LayerTreeInformation';
import {
  exampleConfig as AppToolConfigExample,
  description as AppToolConfigDescription
} from './information/application/ToolConfigInformation';
import {
  exampleConfig as LayerClientConfigExample,
  description as LayerClientConfigDescription,
} from './information/layer/ClientConfigInformation';
import {
  exampleConfig as LayerSourceConfigExample,
  description as LayerSourceConfigDescription
} from './information/layer/SourceConfigInformation';
import {
  exampleConfig as LayerFeaturesExample,
  description as LayerFeaturesDescription
} from './information/layer/FeaturesInformation';
import {
  exampleConfig as UserProviderDetailsExample,
  description as UserProviderDetailsDescription
} from './information/user/ProviderDetailsInformation';
import {
  exampleConfig as UserDetailsExample,
  description as UserDetailsDescription
} from './information/user/DetailsInformation';
import {
  exampleConfig as UserClientConfigExample,
  description as UserClientConfigDescription
} from './information/user/ClientConfigInformation';
import { JSONSchema7 } from 'json-schema';
import { getDocDataforTable } from './information/helpers';

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
      key: 'example'
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

  const getDescription = () => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return AppClientConfigDescription;
      case 'application-layerTree':
        return AppLayerTreeDescription;
      case 'application-layerConfig':
        return AppLayerConfigDescription;
      case 'application-toolConfig':
        return AppToolConfigDescription;

      case 'layer-clientConfig':
        return LayerClientConfigDescription;
      case 'layer-sourceConfig':
        return LayerSourceConfigDescription;
      case 'layer-features':
        return LayerFeaturesDescription;

      case 'user-providerDetails':
        return UserProviderDetailsDescription;
      case 'user-details':
        return UserDetailsDescription;
      case 'user-clientConfig':
        return UserClientConfigDescription;

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

      case 'user-details':
        return getDocDataforTable(schema, 'UserDetails');
      case 'user-clientConfig':
        return getDocDataforTable(schema, 'UserClientConfig');

      // TODO: no definition coming from the backend
      case 'layer-features':
      case 'user-providerDetails':
      default:
        return [{
          propertyName: 'propertyName',
          description: 'description',
          example: 'example',
          dataType: 'dataType',
          required: 'required',
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
          Example: 'example'
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

  // The data to use for the table
  const documentTableData = groupDocumentationData(getTableData(), dataField);

  return (
    <Modal
      width='95vw'
      visible={isModalOpen}
      title={(
        <Title level={2}>
          {`${entity} ${t('InformationModal.titlePredicate')}`}
        </Title>
      )}
      onCancel={handleCancel}
      mask={false}
      destroyOnClose={true}
      cancelText={t('InformationModal.closeButtonText')}
      okButtonProps={{ hidden: true }}
    >
      <Typography>
        <Typography.Paragraph>
          {getDescription()}
        </Typography.Paragraph>
      </Typography>
      <Divider />
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
      <Divider />
      <Title level={3}> Example </Title>
      <pre><code>
        {getExample()}
      </code></pre>
    </Modal>
  );
};

export default InformationModal;

