import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Logger from 'js-logger';

import './JSONEditor.less';

type OwnProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export type JSONEditorProps = OwnProps;

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange
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
        />
    );
}

export default JSONEditor;
