import './MarkdownEditor.less';

import React, { useEffect, useState } from 'react';

import { FullscreenOutlined } from '@ant-design/icons';
import MDEditor, { ICommand } from '@uiw/react-md-editor';

import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { FullscreenWrapper } from '../../FullscreenWrapper/FullscreenWrapper';

export interface MarkdownEditorProps {
  value?: string;
  onChange?: (value?: string) => void;
  fullscreenTitle?: string;
}

export const commandsFilter = (command: ICommand) => {
  if (command?.name === 'fullscreen') {
    return false;
  }
  return command;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  fullscreenTitle,
  onChange = () => undefined
}) => {
  const [markdown, setMarkdown] = useState<string>();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const {
    t
  } = useTranslation();

  useEffect(() => {
    setMarkdown(value);
  }, [value]);

  const onMarkdownChange = (val?: string) => {
    setMarkdown(val);
    onChange(val);
  };

  return (
    <FullscreenWrapper
      isFullscreen={false}
      title={fullscreenTitle}
    >
      <MDEditor
        value={markdown}
        commandsFilter={commandsFilter}
        onChange={onMarkdownChange}
        highlightEnable={false}
      />
      <Tooltip
        title={isFullScreen
          ? t('FullscreenWrapper.leaveFullscreen')
          : t('FullscreenWrapper.fullscreen')
        }
      >
        <Button
          onClick={() => setTimeout(() => setIsFullScreen(!isFullScreen), 0)}
          icon={<FullscreenOutlined />}
        />
      </Tooltip>
    </FullscreenWrapper>
  );
};

export default MarkdownEditor;
