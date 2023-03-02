import './UserPermissionModal.less';

import React, {
  useEffect,
  useState
} from 'react';

import {
  PlusOutlined
} from '@ant-design/icons';

import {
  Button,
  ModalProps,
  Modal,
  Select,
  Form,
  message,
  Tooltip
} from 'antd';

import {
  DefaultOptionType
} from 'antd/lib/select';

import Logger from 'js-logger';

import {
  CustomTagProps
} from 'rc-select/lib/BaseSelect';

import {
  useTranslation
} from 'react-i18next';

import PermissionCollectionType from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import Group from '@terrestris/shogun-util/dist/model/Group';
import User from '@terrestris/shogun-util/dist/model/User';

import PermissionSelect from '../PermissionSelect/PermissionSelect';

import './PermissionModal.less';

type FormData = {
  referenceIds: number[];
  permission: PermissionCollectionType;
};

export interface PermissionModalProps extends ModalProps {
  entityId: number;
  entityType: string;
  setInstancePermission: (entityId: number, referenceId: number, permission: PermissionCollectionType) => Promise<void>;
  getReferences: () => Promise<(User | Group)[]>;
  toTag: (reference: User | Group) => DefaultOptionType;
  tagRenderer?: (props: CustomTagProps) => JSX.Element;
  onSave?: () => void;
  descriptionText?: string;
  referenceLabelText?: string;
  referenceExtraText?: string;
  referenceSelectPlaceholderText?: string;
  permissionSelectLabel?: string;
  permissionSelectExtra?: string;
  saveErrorMsg?: (placeholder: string) => string;
};

const PermissionModal: React.FC<PermissionModalProps> = ({
  entityId,
  entityType,
  setInstancePermission,
  getReferences,
  toTag,
  tagRenderer,
  onSave = () => {},
  descriptionText = '',
  referenceLabelText = '',
  referenceExtraText = '',
  referenceSelectPlaceholderText = '',
  permissionSelectLabel = '',
  permissionSelectExtra = '',
  saveErrorMsg,
  ...passThroughProps
}) => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [references, setReferences] = useState<(User | Group)[]>([]);
  const [options, setOptions] = useState<DefaultOptionType[]>();
  const [visible, setVisible] = useState(false);

  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        setReferences(await getReferences());
      } catch (error) {
        message.error(t('PermissionModal.loadErrorMsg'));
        Logger.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [getReferences, t]);

  useEffect(() => {
    if (Array.isArray(references)) {
      setOptions(references.map(toTag));
    }
  }, [references, toTag]);

  const onClick = () => {
    setVisible(!visible);
  };

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onOk = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    const {
      referenceIds,
      permission
    } = form.getFieldsValue();

    let erroneousRequestReferenceIds = [];

    setIsSaving(true);

    for (const referenceId of referenceIds) {
      try {
        await setInstancePermission(entityId, referenceId, permission);
      } catch (error) {
        erroneousRequestReferenceIds.push(referenceId);
        Logger.error(error);
      }
    }

    if (erroneousRequestReferenceIds.length > 0) {
      message.error(saveErrorMsg(erroneousRequestReferenceIds.join(', ')));
    }

    form.resetFields();
    setIsSaving(false);
    setVisible(false);
    onSave();
  };

  return (
    <>
      <Tooltip
        title={t('PermissionModal.openModalButtonTooltipTitle')}
      >
        <Button
          type="primary"
          onClick={onClick}
          icon={<PlusOutlined />}
        />
      </Tooltip>
      <Modal
        className="permission-modal"
        title={t('PermissionModal.title')}
        open={visible}
        onCancel={onCancel}
        onOk={onOk}
        okButtonProps={{
          loading: isSaving
        }}
        width={800}
        {...passThroughProps}
      >
        <div
          className="description"
        >
          {descriptionText}
        </div>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="referenceIds"
            label={referenceLabelText}
            extra={referenceExtraText}
            rules={[{
              required: true
            }]}
          >
            <Select
              autoFocus
              mode="multiple"
              allowClear
              optionFilterProp={'filterValues'}
              placeholder={referenceSelectPlaceholderText}
              loading={loading}
              options={options}
              tagRender={tagRenderer}
            />
          </Form.Item>
          <Form.Item
            name="permission"
            label={permissionSelectLabel}
            extra={permissionSelectExtra}
            rules={[{
              required: true
            }]}
          >
            <PermissionSelect />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PermissionModal;
