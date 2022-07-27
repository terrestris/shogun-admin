import React, { useState } from 'react';

import {
  Button,
  message
} from 'antd';

import { ButtonProps } from 'antd/lib/button';

import {
  ClearOutlined
} from '@ant-design/icons';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

import { useTranslation } from 'react-i18next';

export interface EvictCacheProps extends Omit<ButtonProps, 'onClick' | 'loading'> { };

export const EvictCache: React.FC<EvictCacheProps> = ({
  ...passThroughProps
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const client = useSHOGunAPIClient();

  const {
    t
  } = useTranslation();

  const onClearCacheClick = async () => {

    setIsLoading(true);

    try {
      await client.cache().evictCache();

      message.success('Successfully cleared the cache');
    } catch (error) {
      message.error('Could not clear the cache');
    }

    setIsLoading(false);
  };

  return (
    <Button
      onClick={onClearCacheClick}
      loading={isLoading}
      icon={<ClearOutlined />}
      {...passThroughProps}
    >
      {t('GlobalSettingsRoot.cache')}
    </Button>
  );
};

export default EvictCache;
