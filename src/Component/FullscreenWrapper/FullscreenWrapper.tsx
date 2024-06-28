import './FullscreenWrapper.less';

import React, { useRef, useState } from 'react';

import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';

export const FullscreenWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children
}) => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [minimizedHeight, setMinimizedHeight] = useState<string>('10em');
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    t
  } = useTranslation();

  const toggleFullscreen = () => {
    const contentEl = document.querySelector('.content');
    const leftContainerEl = document.querySelector('.content .left-container');
    const shouldBeFullScreen = !fullscreen;
    const element = elementRef.current;
    if (!element) {
      return;
    }
    if (contentEl && leftContainerEl && shouldBeFullScreen) {
      setMinimizedHeight(element.getBoundingClientRect().height + 'px');
      const contentDimensions = contentEl.getBoundingClientRect();
      const leftContainerDimensions = leftContainerEl.getBoundingClientRect();
      element.style.left = `${contentDimensions.left}px`;
      element.style.top = `${leftContainerDimensions.top}px`;
      element.style.width = `${contentDimensions.width}px`;
      element.style.height = `${leftContainerDimensions.height}px`;
    } else {
      element.style.left = '';
      element.style.top = '';
      element.style.width = '';
      element.style.height = minimizedHeight;
    }
    setFullscreen(shouldBeFullScreen);
  };

  /**
   * Exit fullscreen when Esc is pressed.
   */
  useHotkeys('esc', toggleFullscreen, {
    enabled: () => fullscreen,
    enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT']
  });

  const wrapperCls = `fs-wrapper${fullscreen ? ' fullscreen' : ''}`;

  return (
    <div className={wrapperCls} ref={elementRef}>
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
      {children}
    </div>
  );
};

export default FullscreenWrapper;
