import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useHistory,
  useLocation,
  matchPath,
  Link
} from 'react-router-dom';
import { Button, PageHeader, Form } from 'antd';

import GeneralEntityForm, { FormConfig } from '../GeneralEntityForm/GeneralEntityForm';
import GeneralEntityTable from '../GeneralEntityTable/GeneralEntityTable';

import config from 'shogunApplicationConfig';
import GenericService from '../../../Service/GenericService/GenericService';
import BaseEntity from '../../../Model/BaseEntity';

import './GeneralEntityRoot.less';
import { Logger } from '@terrestris/base-util';
import { GenericEntityController, FormValues } from '../../../Controller/GenericEntityController';
import { NamePath } from 'rc-field-form/lib/interface';
import { FormOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';

export type GeneralEntityConfigType = {
  endpoint: string;
  entityType: string;
  entityName?: string;
  navigationTitle?: string;
  subTitle?: string;
  formConfig: FormConfig;
};

type OwnProps<T extends BaseEntity> = GeneralEntityConfigType;

export type GeneralEntityRootProps<T extends BaseEntity> = OwnProps<T> &
  React.HTMLAttributes<HTMLDivElement>;

class GenericServiceImpl extends GenericService<BaseEntity> {
  constructor(endpoint: string) {
    super(BaseEntity, `${config.appPrefix}/${endpoint}`);
  }
};

export function GeneralEntityRoot<T extends BaseEntity> ({
  endpoint,
  entityType,
  entityName = 'Entität',
  navigationTitle = 'Entitäten',
  subTitle = '… mit denen man Dingen tun kann (aus Gründen bspw.)',
  formConfig
}: GeneralEntityRootProps<T>) {

  const [id, setId] = useState<number | 'create'>();
  const [entity, setEntity] = useState<T>();
  const [form] = Form.useForm();

  const validate = useCallback(async (nameList?: NamePath[]) => {
    let valid: boolean;
    try {
      await form.validateFields(nameList);
      valid = true;
    } catch (e) {
      if ('errorFields' in e) {
        valid = false;
      } else {
        throw e;
      }
    }
    return valid;
  }, [form]);

  const updateForm = useCallback(async (values: FormValues): Promise<void> => {
    form.setFieldsValue(values);
    validate();
  }, [form, validate]);

  const genericService: GenericServiceImpl = useMemo(() => new GenericServiceImpl(endpoint), [endpoint]);
  const genericController: GenericEntityController<T> = useMemo(() => new GenericEntityController<T>({
    service: genericService as GenericService<T>,
    formUpdater: updateForm,
    formConfig
  }), [genericService, updateForm, formConfig]);

  const fetchEntity = useCallback(async (eId: number) => {
    try {
      const e: T = await genericController?.load(eId);
      setEntity(e);
      form.resetFields();
    } catch (error) {
      Logger.error(error);
    }
  }, [form, genericController]);

  useEffect(() => {
    if (id && id.toString() !== 'create' && id !== entity?.id) {
      fetchEntity(parseInt(id.toString(), 10));
    } else if (id && id.toString() === 'create') {
      entity.id = null;
      entity.created = null;
      entity.modified = null;
    }
  }, [id, fetchEntity, entity]);

  const history = useHistory();
  const location = useLocation();
  const match = matchPath<{ entityId: string }>(location.pathname, {
    path: `${config.appPrefix}/portal/${entityType}/:entityId`
  });
  const entityId = match?.params?.entityId;

  useEffect(() => {
    if (!entityId) {
      setId(undefined);
      return;
    }
    if (entityId === 'create') {
      setId(entityId);
    } else {
      setId(parseInt(entityId, 10));
    }
  }, [entityId]);

  // Once the controller is known we need to set the formUpdater so we can update
  // a given form when the entity is updated via controller
  useEffect(() => {
    if (genericController) {
      genericController.setFormUpdater(updateForm);
    }
  }, [updateForm, genericController]);

  const initialValues = genericController?.getInitialFormValues();

  return (
    <div className="general-entity-root">
      <PageHeader
        className="header"
        onBack={() => history.goBack()}
        title={navigationTitle}
        subTitle={subTitle}
        extra={[
          <Link key="create" to={`${config.appPrefix}/portal/${entityType}/create`}>
            <Button type="primary" key="create" icon={<FormOutlined />}>
              {`${entityName} anlegen`}
            </Button>
          </Link>,
          <Button type="primary" key="save" icon={<SaveOutlined />}>
            {`${entityName} speichern`}
          </Button>,
          <Button type="primary" key="reset" icon={<UndoOutlined />} disabled={!form.isFieldsTouched()}>
            {`${entityName} zurücksetzen`}
          </Button>
        ]}
      >
      </PageHeader>
      <div className="left-container">
        <GeneralEntityTable
          entityType={entityType}
          service={genericService}
        />
      </div>
      {
        id &&
        <div className="right-container">
          <GeneralEntityForm
            formConfig={formConfig}
            form={form}
            formProps={{
              initialValues
            }}
          />
        </div>
      }
    </div>
  );
};

export default GeneralEntityRoot;
