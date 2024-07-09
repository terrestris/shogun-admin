import './JSONEditor.less';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import Editor, {
  EditorProps,
  OnChange,
  useMonaco
} from '@monaco-editor/react';

import Logger from 'js-logger';
import { uniqueId } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import _isNil from 'lodash/isNil';

import {
  swaggerDocs
} from '../../../State/static';
import OpenAPIUtil from '../../../Util/OpenAPIUtil';
import FullscreenWrapper from '../../FullscreenWrapper/FullscreenWrapper';

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
