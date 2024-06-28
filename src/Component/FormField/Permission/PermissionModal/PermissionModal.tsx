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
  Tooltip,
  Divider,
  Pagination
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
import { Page } from '@terrestris/shogun-util/dist/model/Page';
import Role from '@terrestris/shogun-util/dist/model/Role';
import User from '@terrestris/shogun-util/dist/model/User';
import { PageOpts } from '@terrestris/shogun-util/dist/service/GenericService';

import PermissionSelect from '../PermissionSelect/PermissionSelect';

import './PermissionModal.less';

type FormData = {
  referenceIds: number[];
  permission: PermissionCollectionType;
};

export interface PermissionModalProps extends ModalProps {
  entityId: number;
  setInstancePermission: (entityId: number, referenceId: number, permission: PermissionCollectionType) => Promise<void>;
  getReferences?: (pageOpts?: PageOpts) => Promise<Page<(User | Group | Role)> | undefined>;
  toTag: (reference: User | Group | Role) => DefaultOptionType;
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
  saveErrorMsg = () => '',
  ...passThroughProps
}) => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [references, setReferences] = useState<(User | Group | Role)[]>([]);
  const [options, setOptions] = useState<DefaultOptionType[]>();
  const [visible, setVisible] = useState(false);

  const [referencePage, setReferencePage] = useState<number>(1);
  const [referenceTotal, setReferenceTotal] = useState<number>();

  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();

  const referencePageSize = 20;

  useEffect(() => {
    if (!getReferences) {
      return;
    }

    (async () => {
      setLoading(true);

      try {
        const refs = await getReferences({
          page: referencePage - 1,
          size: referencePageSize
        });

        if (!refs) {
          throw new Error('Failed to load references');
        }

        setReferenceTotal(refs.totalElements);
        setReferencePage(refs.number + 1);
        setReferences(refs.content);
      } catch (error) {
        message.error(t('PermissionModal.loadErrorMsg'));
        Logger.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [getReferences, t, referencePage]);

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

  const onPaginationChange = (page: number) => {
    setReferencePage(page);
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
              dropdownRender={menu => (
                <div
                  className="permission-modal-reference-dropdown"
                >
                  {menu}
                  <Divider />
                  <Pagination
                    total={referenceTotal}
                    showTotal={total => `${t('PermissionModal.paginationTotal')}: ${total}`}
                    locale={{
                      // eslint-disable-next-line camelcase
                      next_page: t('PermissionModal.paginationNextPage'),
                      // eslint-disable-next-line camelcase
                      prev_page: t('PermissionModal.paginationPrevPage')
                    }}
                    onChange={onPaginationChange}
                    current={referencePage}
                    pageSize={referencePageSize}
                    size='small'
                  />
                </div>
              )}
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
