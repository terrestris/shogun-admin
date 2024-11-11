import React, {
  useState
} from 'react';

import {
  TagOutlined
} from '@ant-design/icons';
import {
  Button,
  message,
  Tooltip
} from 'antd';
import { ButtonProps } from 'antd/lib/button';

import { useTranslation } from 'react-i18next';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import Logger from '../../Logger';

export type CreateAllRolesButtonProps = Omit<ButtonProps, 'onClick' | 'loading'> & {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const CreateAllRolesButton: React.FC<CreateAllRolesButtonProps> = ({
  onSuccess,
  onError,
  ...passThroughProps
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const client = useSHOGunAPIClient();

  const {
    t
  } = useTranslation();

  const onCreateRolesClick = async () => {
    setIsLoading(true);

    try {
      await client?.role().createAllFromProvider();

      messageApi.success(t('CreateAllRolesButton.success'));

      onSuccess?.();
    } catch (error) {
      messageApi.error(t('CreateAllRolesButton.error'));

      Logger.error('Error while creating the roles: ', error);

      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Tooltip
        title={t('CreateAllRolesButton.tooltip')}
      >
        <Button
          onClick={onCreateRolesClick}
          loading={isLoading}
          icon={<TagOutlined />}
          {...passThroughProps}
        >
          {t('CreateAllRolesButton.title')}
        </Button>
      </Tooltip>
    </>
  );
};

export default CreateAllRolesButton;
