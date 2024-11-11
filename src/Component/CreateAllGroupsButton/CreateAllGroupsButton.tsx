import React, {
  useState
} from 'react';

import {
  UsergroupAddOutlined
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

export type CreateAllGroupsButtonProps = Omit<ButtonProps, 'onClick' | 'loading'> & {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const CreateAllGroupsButton: React.FC<CreateAllGroupsButtonProps> = ({
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

  const onCreateGroupsClick = async () => {
    setIsLoading(true);

    try {
      await client?.group().createAllFromProvider();

      messageApi.success(t('CreateAllGroupsButton.success'));

      onSuccess?.();
    } catch (error) {
      messageApi.error(t('CreateAllGroupsButton.error'));

      Logger.error('Error while creating the groups: ', error);

      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Tooltip
        title={t('CreateAllGroupsButton.tooltip')}
      >
        <Button
          onClick={onCreateGroupsClick}
          loading={isLoading}
          icon={<UsergroupAddOutlined />}
          {...passThroughProps}
        >
          {t('CreateAllGroupsButton.title')}
        </Button>
      </Tooltip>
    </>
  );
};

export default CreateAllGroupsButton;
