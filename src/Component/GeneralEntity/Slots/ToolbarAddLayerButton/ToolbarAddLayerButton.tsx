import {
  useContext,
  useState
} from 'react';

import {
  AppstoreAddOutlined
} from '@ant-design/icons';

import {
  Button,
  Modal,
  Result,
  Tooltip
} from 'antd';

import {
  useTranslation
} from 'react-i18next';

import GeneralEntityRootContext from '../../../../Context/GeneralEntityRootContext';

import AddLayerModal, {
  ImportResult
} from '../../../AddLayerModal';

export interface ToolbarAddLayerButtonProps {};

export const ToolbarAddLayerButton: React.FC<ToolbarAddLayerButtonProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [result, setResult] = useState<ImportResult>();

  const generalEntityRootContext = useContext(GeneralEntityRootContext);

  const {
    t
  } = useTranslation();

  const onClick = () => {
    setIsModalOpen(true);
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onSave = (r: ImportResult) => {
    setResult(r);
    setIsResultModalOpen(true);
  };

  const getStatus = () => {
    const hasError = result && result.errors.length > 0;
    const hasSuccess = result && result.layers.length > 0;

    if (!hasError && hasSuccess) {
      return 'success';
    }

    if (hasError && !hasSuccess || !hasError && !hasSuccess) {
      return 'error';
    }

    return 'warning';
  };

  const getTitle = () => {
    const status = getStatus();

    if (status === 'success') {
      return t('ToolbarAddLayerButton.successMsg');
    }

    if (status === 'error') {
      return t('ToolbarAddLayerButton.errorMsg');
    }

    return t('ToolbarAddLayerButton.warningMsg');
  };

  const getSubTitle = () => {
    const status = getStatus();
    const successList = result?.layers.map(layer => (
      <span
        key={layer.id}
      >
        <a
          href={`portal/layer/${layer.id}`}
          target="_blank"
        >
          {`${layer.name} (${layer.id})`}
        </a>
        <br />
      </span>
    ));
    const errorList = result?.errors.map(error => (
      <span
        key={error.layerName}
      >
        {`${error.layerName}`}
        <br />
      </span>
    ));

    if (status === 'success') {
      return (
        <div>
          <p>
            {t('ToolbarAddLayerButton.successSubTitle')}
          </p>
          {successList}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div>
          <p>
            {t('ToolbarAddLayerButton.errorSubTitle')}
          </p>
          {errorList}
        </div>
      );
    }

    return (
      <div>
        <p>
          {t('ToolbarAddLayerButton.successSubTitle')}
        </p>
        {successList}
        <p>
          {t('ToolbarAddLayerButton.errorSubTitle')}
        </p>
        {errorList}
      </div>
    );
  };

  return (
    <>
      <Tooltip
        title={t('ToolbarAddLayerButton.tooltip')}
      >
        <Button
          icon={<AppstoreAddOutlined />}
          onClick={onClick}
        >
          {t('ToolbarAddLayerButton.title')}
        </Button>
      </Tooltip>
      <AddLayerModal
        maskClosable={false}
        open={isModalOpen}
        onCancel={onCancel}
        onSave={onSave}
      />
      <Modal
        open={isResultModalOpen}
        onCancel={() => {
          setIsResultModalOpen(false);
          setIsModalOpen(false);
          generalEntityRootContext?.fetchEntities?.();
        }}
        maskClosable={false}
        footer={null}
      >
        <Result
          status={getStatus()}
          title={getTitle()}
          subTitle={getSubTitle()}
        />
      </Modal>
    </>
  );
};

export default ToolbarAddLayerButton;
