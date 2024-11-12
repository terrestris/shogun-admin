import React, {
  useState
} from 'react';

import {
  UserAddOutlined
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

export type CreateAllUsersButtonProps = Omit<ButtonProps, 'onClick' | 'loading'> & {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const CreateAllUsersButton: React.FC<CreateAllUsersButtonProps> = ({
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

  const onCreateUsersClick = async () => {
    setIsLoading(true);

    try {
      await client?.user().createAllFromProvider();

      messageApi.success(t('CreateAllUsersButton.success'));

      onSuccess?.();
    } catch (error) {
      messageApi.success(t('CreateAllUsersButton.error'));

      Logger.error('Error while creating the users: ', error);

      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Tooltip
        title={t('CreateAllUsersButton.tooltip')}
      >
        <Button
          onClick={onCreateUsersClick}
          loading={isLoading}
          icon={<UserAddOutlined />}
          {...passThroughProps}
        >
          {t('CreateAllUsersButton.title')}
        </Button>
      </Tooltip>
    </>
  );
};

export default CreateAllUsersButton;
