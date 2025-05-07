import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import {
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons';

import {
  Button,
  Tooltip
} from 'antd';

import {
  useHotkeys
} from 'react-hotkeys-hook';

import {
  useTranslation
} from 'react-i18next';

import './FullscreenWrapper.less';

export const FullscreenWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    t
  } = useTranslation();

  const updateSize = useCallback(() => {
    const contentEl = document.querySelector('.content');
    const leftContainerEl = document.querySelector('.content .left-container');
    const element = elementRef.current;

    if (!element) {
      return;
    }

    if (contentEl && leftContainerEl && isFullscreen) {
      const contentDimensions = contentEl.getBoundingClientRect();
      const leftContainerDimensions = leftContainerEl.getBoundingClientRect();
      element.style.left = `${contentDimensions.left + 2}px`;
      element.style.top = `${leftContainerDimensions.top}px`;
      element.style.width = `${contentDimensions.width - 6}px`;
      element.style.height = `${leftContainerDimensions.height - 4}px`;
    } else {
      element.style.left = '';
      element.style.top = '';
      element.style.width = '';
      element.style.height = '20em';
    }
  }, [isFullscreen]);

  const onResize = useCallback(() => {
    updateSize();
  }, [updateSize]);

  useEffect(() => {
    const leftContainerEl = document.querySelector('.content .left-container');

    if (!leftContainerEl) {
      return;
    }

    const resizeObserver = new ResizeObserver(onResize);

    resizeObserver.observe(leftContainerEl);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize]);

  useEffect(() => {
    updateSize();
  }, [updateSize]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const onEscapeClick = () => {
    toggleFullscreen();
  };

  useHotkeys('esc', onEscapeClick, {
    enabled: isFullscreen,
    enableOnFormTags: ['INPUT', 'TEXTAREA', 'SELECT']
  }, [isFullscreen]);

  const wrapperCls = `fs-wrapper${isFullscreen ? ' fullscreen' : ''}`;

  return (
    <div
      className={wrapperCls}
      ref={elementRef}
    >
      <Tooltip
        title={isFullscreen ? t('FullscreenWrapper.leaveFullscreen') : t('FullscreenWrapper.fullscreen') }
        placement='left'
        mouseEnterDelay={1.0}
        mouseLeaveDelay={0.0}
      >
        <Button
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          size='small'
          onClick={toggleFullscreen}
        />
      </Tooltip>
      {children}
    </div>
  );
};

export default FullscreenWrapper;
