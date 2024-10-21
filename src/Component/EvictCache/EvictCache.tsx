import React, { useState } from 'react';

import {
  ClearOutlined
} from '@ant-design/icons';
import {
  Button,
  message
} from 'antd';
import { ButtonProps } from 'antd/lib/button';
import _isNil from 'lodash/isNil';
import { useTranslation } from 'react-i18next';

import logger from '@terrestris/base-util/dist/Logger';

import useSHOGunAPIClient from '../../Hooks/useSHOGunAPIClient';

export interface EvictCacheProps extends Omit<ButtonProps, 'onClick' | 'loading'> { }

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
      await client?.cache().evictCache();

      message.success('Successfully cleared the cache');
    } catch (error) {
      message.error('Could not clear the cache');
      logger.error(`Could not clear the cache due to the following error: ${error}`);
    }

    setIsLoading(false);
  };

  if (_isNil(client)) {
    return null;
  }

  return (
    <Button
      onClick={onClearCacheClick}
      loading={isLoading}
      icon={<ClearOutlined />}
      {...passThroughProps}
    >
      {t('EvictCache.clear')}
    </Button>
  );
};

export default EvictCache;
