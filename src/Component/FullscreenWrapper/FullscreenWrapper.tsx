import React from 'react';
import { FullscreenExitOutlined, FullscreenOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import './FullscreenWrapper.less';
import InformationModal from '../InformationModal/InformationModal';

interface OwnProps {
  showInformationButton?: boolean;
  infoFor?: string;
}

type FullscreenWrapperProps = React.HTMLAttributes<HTMLDivElement> & OwnProps;

export const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({
  children,
  showInformationButton = false,
  infoFor = '',
}) => {
  const [fullscreen, setFullscreen] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const {
    t
  } = useTranslation();

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const openInformationModal = () => {
    setIsModalOpen(true);
  };

  const wrapperCls = `fs-wrapper${fullscreen ? ' fullscreen' : ''}`;

  return (
    <>
      <div className={wrapperCls}>
        <div className='fs-wrapper-tools'>
          {showInformationButton && (
            <Tooltip
              title={t('FullscreenWrapper.information') }
              placement='left'
            >
              <Button
                icon={<InfoCircleOutlined />}
                size='small'
                onClick={openInformationModal}
              />
            </Tooltip>
          )}
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

      <InformationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        infoFor={infoFor}
      />
    </>
  );
};

export default FullscreenWrapper;
