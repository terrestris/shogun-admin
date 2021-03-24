import React, { useEffect } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import Logger from 'js-logger';

import './JSONEditor.less';

export type JSONEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  editorProps: EditorProps;
};

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange,
  editorProps
}) => {
    const [currentValue, setCurrentValue] = React.useState<string>();

    const changeHandler = (value: string) => {
      try {
        const jsonObject = JSON.parse(value);
        onChange(jsonObject);
      } catch (error) {
        Logger.trace('JSON-Editor:', error);
      }
    };

    useEffect(() => {
      if (!value) {
        setCurrentValue(undefined);
      } else {
        try {
          const jsonString = JSON.stringify(value, null, 2);
          if (jsonString) {
            setCurrentValue(jsonString);
          }
        } catch (error) {
          Logger.trace('JSON-Editor:', error);
        }
      }
    }, [value]);

    return (
        <Editor
          className="json-editor"
          value={currentValue}
          onChange={changeHandler}
          defaultLanguage="json"
          {...editorProps}
        />
    );
}

export default JSONEditor;
