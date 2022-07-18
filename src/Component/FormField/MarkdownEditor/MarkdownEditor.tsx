import React, { useEffect } from 'react';
import MDEditor, { ICommand } from '@uiw/react-md-editor';
import FullscreenWrapper from '../../FullscreenWrapper/FullscreenWrapper';

export type MarkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export const commandsFilter = (command: ICommand) => {
  if (command?.name === 'fullscreen') {
    return false;
  }
  return command;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange
}) => {
  const [markdown, setMarkdown] = React.useState<string>();

  useEffect(() => {
    setMarkdown(value);
  }, [value]);

  const onMarkdownChange = (val: string) => {
    setMarkdown(val);
    onChange(val);
  };

  return (
    <FullscreenWrapper>
      <MDEditor
        value={markdown}
        commandsFilter={commandsFilter}
        onChange={onMarkdownChange}
        highlightEnable={false}
      />
    </FullscreenWrapper>
  );
};

export default MarkdownEditor;
