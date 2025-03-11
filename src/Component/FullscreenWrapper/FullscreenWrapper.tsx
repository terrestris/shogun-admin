import { useEffect, useMemo } from 'react';

import { Modal } from 'antd';

import './FullscreenWrapper.less';

export interface FullscreenWrapperProps {
  isFullscreen: boolean;
  children: React.ReactNode;
  title?: string;
}

export const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({
  children,
  isFullscreen,
  title
}) => {

  const PADDING = 20;

  const style = useMemo(() => {
    if (!isFullscreen) {return {};}

    const contentEl = document.querySelector('.content');
    const leftContainerEl = document.querySelector('.content .left-container');

    if (!contentEl || !leftContainerEl) {return {};}

    const contentDimensions = contentEl.getBoundingClientRect();
    const leftContainerDimensions = leftContainerEl.getBoundingClientRect();

    return {
      margin: 0,
      left: `${contentDimensions.left + PADDING/2}px`,
      top: `${leftContainerDimensions.top + PADDING/2}px`,
      height: `${window.innerHeight - leftContainerDimensions.top - PADDING}px`
    };
  }, [isFullscreen]);

  const width = useMemo(() => {
    if (!isFullscreen) {return {};}

    const contentEl = document.querySelector('.content');
    const leftContainerEl = document.querySelector('.content .left-container');
    if (!contentEl || !leftContainerEl) {return {};}
    const leftContainerDimensions = leftContainerEl.getBoundingClientRect();

    return `${window.innerWidth - leftContainerDimensions.left - PADDING}px`;
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isFullscreen]);

  if (!isFullscreen) {return children;}

  return (
    <Modal
      title={title}
      open={isFullscreen}
      wrapClassName="fullscreen-wrapper-wrapper"
      className="fullscreen-wrapper"
      footer={null}
      closable={false}
      maskClosable={false}
      width={width}
      style={style}
    >
      {children}
    </Modal>
  );
};
