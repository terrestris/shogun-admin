import React, { useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

export type MarkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
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
    <MDEditor
      value={markdown}
      onChange={onMarkdownChange}
    />
  );
};

export default MarkdownEditor;
