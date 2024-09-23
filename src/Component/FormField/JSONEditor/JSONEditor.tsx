import './JSONEditor.less';

// import './UserWorker';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import Editor, {
  EditorProps,
  OnChange,
  useMonaco,
  loader
} from '@monaco-editor/react';

import Logger from 'js-logger';
import { uniqueId } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import _isNil from 'lodash/isNil';

import * as monaco from 'monaco-editor';

import {
  swaggerDocs
} from '../../../State/static';
import OpenAPIUtil from '../../../Util/OpenAPIUtil';
import FullscreenWrapper from '../../FullscreenWrapper/FullscreenWrapper';

// loader.config({ monaco });

// @ts-ignore

// self.MonacoEnvironment = {
//   getWorker: function (moduleId, label) {
//     if (label === 'json') {
//       return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
//     }
//     if (label === 'css' || label === 'scss' || label === 'less') {
//       return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
//     }
//     if (label === 'html' || label === 'handlebars' || label === 'razor') {
//       return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url));
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return new Worker(
//         new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url),
//       );
//     }
//     return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
//   }
// };

loader.config({ monaco });

export type JSONEditorProps = {
  value?: string;
  onChange?: (value?: string) => void;
  editorProps?: EditorProps;
  entityType: string;
  dataField: string;
};

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange = () => undefined,
  editorProps,
  entityType,
  dataField
}) => {
  const [currentValue, setCurrentValue] = useState<string>();

  const monaco = useMonaco();

  const openApiUtil = useMemo(() => new OpenAPIUtil({
    document: swaggerDocs
  }), []);

  const registerSchemaValidation = useCallback(() => {
    if (!monaco) {
      return undefined;
    }

    const propertyRefName = openApiUtil.getPropertyRefName(entityType, dataField);
    if (_isNil(propertyRefName)) {
      return undefined;
    }
    const schema = openApiUtil.getJSONSchemaFromDocument(propertyRefName, entityType, dataField);

    if (_isNil(monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas)) {
      return undefined;
    }

    const schemas = [
      ...cloneDeep(monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas),
      {
        uri: schema.$id ?? uniqueId('json-schema-id'),
        fileMatch: [`${propertyRefName}.json`],
        schema: schema
      }
    ];

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      enableSchemaRequest: true,
      validate: true,
      trailingCommas: 'error',
      schemaValidation: 'error',
      comments: 'error',
      schemas: schemas
    });
  }, [monaco, dataField, entityType, openApiUtil]);

  useEffect(() => {
    registerSchemaValidation();
  }, [registerSchemaValidation]);

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

  const changeHandler: OnChange = (val?: string) => {
    if (_isNil(val)) {
      onChange();
      return;
    }
    try {
      const jsonObject = JSON.parse(val);
      onChange(jsonObject);
    } catch (error) {
      if (val.length === 0) {
        onChange();
      }
      Logger.trace('JSON-Editor:', error);
    }
  };

  return (
    <FullscreenWrapper>
      <div className='json-editor'>
        <Editor
          value={currentValue}
          onChange={changeHandler}
          path={
            openApiUtil.getPropertyRefName(entityType, dataField) ?
              `${openApiUtil.getPropertyRefName(entityType, dataField)}.json` :
              undefined
          }
          language="json"
          options={{
            lineHeight: 20,
            scrollBeyondLastLine: false
          }}
          {...editorProps}
        />
      </div>
    </FullscreenWrapper>
  );
};

export default JSONEditor;
