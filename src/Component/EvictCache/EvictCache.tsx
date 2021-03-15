import React, { useState } from 'react';

import {
  Button,
  message
} from 'antd';

import { ButtonProps } from 'antd/lib/button';

import {
  ClearOutlined
} from '@ant-design/icons';

import CacheService from '../../Service/CacheService/CacheService';

const cacheService = new CacheService();

export interface EvictCacheProps extends Omit<ButtonProps, 'onClick' | 'loading'> { };

export const EvictCache: React.FC<EvictCacheProps> = ({
  ...passThroughProps
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClearCacheClick = async () => {

    setIsLoading(true);

    const success = await cacheService.evictCache();

    if (success) {
      message.success('Successfully cleared the cache');
    } else {
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
      Cache leeren
    </Button>
  );
};

export default EvictCache;
