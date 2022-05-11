import React from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import './FullscreenWrapper.less';

export const FullscreenWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children
}) => {
  const [fullscreen, setFullscreen] = React.useState<boolean>(false);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const wrapperCls = `fs-wrapper${fullscreen ? ' fullscreen' : ''}`;

  return (
    <div className={wrapperCls}>
      <div>
        <Tooltip
          title={`Vollbild ${fullscreen ? ' verlassen' : ''}`}
          placement='left'
        >
          <Button
            icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            size='small'
            onClick={toggleFullscreen}
          />
        </Tooltip>
      </div>
      {children}
    </div>
  );
};

export default FullscreenWrapper;
