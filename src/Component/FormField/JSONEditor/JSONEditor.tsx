import React, { useEffect } from 'react';
import {
  IControlledCodeMirror as CodeMirrorProps,
  Controlled as CodeMirror
} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import Logger from 'js-logger';

import './JSONEditor.less';

type OwnProps = {
  value?: string;
  onChange?: (value: string) =>  void;
};

export type JSONEditorProps = OwnProps & Omit<CodeMirrorProps, 'onBeforeChange' | 'value' | 'onChange'>;

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange
}) => {

    const [currentValue, setCurrentValue] = React.useState<string>();

    const changeHandler = (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => {
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
        <CodeMirror
          className="json-editor"
          value={currentValue}
          onBeforeChange={(editor, data, value) => setCurrentValue(value)}
          onChange={changeHandler}
          options={{
            mode: 'javascript',
            lineWrapping: true
          }}
        />
    );
}

export default JSONEditor;
