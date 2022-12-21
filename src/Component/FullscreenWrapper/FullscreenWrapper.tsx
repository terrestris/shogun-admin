import React from 'react';
import { FullscreenExitOutlined, FullscreenOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import './FullscreenWrapper.less';
// import InformationModal from '../InformationModal/InformationModal';
import { JSONSchema7 } from 'json-schema';

interface OwnProps {
  dataField?: string;
  entity?: string;
  schema?: JSONSchema7;
  toolItems?: JSX.Element[];
}

type FullscreenWrapperProps = React.HTMLAttributes<HTMLDivElement> & OwnProps;

export const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({
  children,
  toolItems
}) => {
  const [fullscreen, setFullscreen] = React.useState<boolean>(false);

  const {
    t
  } = useTranslation();

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const wrapperCls = `fs-wrapper${fullscreen ? ' fullscreen' : ''}`;

  return (
    <>
      <div className={wrapperCls}>
        <div className='fs-wrapper-tools'>

          {/* Tools to be shown next to the full screen button */}
          {toolItems.length > 0 && toolItems.map(tool => tool)}

          <Tooltip
            title={fullscreen ? t('FullscreenWrapper.leaveFullscreen') : t('FullscreenWrapper.fullscreen') }
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
    </>
  );
};

export default FullscreenWrapper;
