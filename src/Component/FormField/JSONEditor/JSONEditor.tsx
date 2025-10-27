import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  MenuUnfoldOutlined
} from '@ant-design/icons';

import {
  DiffEditor,
  Editor,
  EditorProps,
  OnChange,
  useMonaco,
  loader,
  MonacoDiffEditor
} from '@monaco-editor/react';

import {
  Button,
  Tooltip
} from 'antd';

import Logger from 'js-logger';

import {
  uniqueId
} from 'lodash';

import cloneDeep from 'lodash/cloneDeep';

import _isNil from 'lodash/isNil';

import * as monacoEditor from 'monaco-editor';

import config from 'shogunApplicationConfig';

import {
  useTranslation
} from 'react-i18next';

import useAppDispatch from '../../../Hooks/useAppDispatch';
import useAppSelector from '../../../Hooks/useAppSelector';

import { setOriginalConfigValues } from '../../../store/originalConfigValues';

import OpenAPIUtil from '../../../Util/OpenAPIUtil';

import CopyToClipboardButton from '../../CopyToClipboardButton/CopyToClipboardButton';
import FullscreenWrapper from '../../FullscreenWrapper/FullscreenWrapper';

import './JSONEditor.less';

loader.config({ monaco: monacoEditor });

export interface JSONEditorProps {
  initialValue?: string;
  onChange?: (value?: string) => void;
  editorProps?: EditorProps;
  entityType: string;
  dataField: string;
  indentSize?: number;
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  initialValue,
  onChange: onChangeProp,
  editorProps,
  entityType,
  dataField,
  indentSize = 2
}) => {
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    JSON.stringify(initialValue || undefined, null, indentSize)
  );
  // We need to keep track of whether the document has been formatted initially. This is necessary
  // because the document will be formatted on mount, which will trigger the onChange event. We
  // don't want to trigger the onChange event on mount, so we need to keep track of whether the
  // document has been formatted initially.
  const [isFormattedInitially, setIsFormattedInitially] = useState<boolean>(false);

  const openApiDocs = useAppSelector(state => state.openApiDocs);
  const originalValues = useAppSelector(state => state.originalConfigValues);
  const originalValue = originalValues[`${entityType}.${dataField}`];

  const historyEnabled = config.entityHistory?.enabled;

  const {
    t
  } = useTranslation();

  const monaco = useMonaco();
  const dispatch = useAppDispatch();

  if (originalValue === undefined && currentValue) {
    dispatch(setOriginalConfigValues({
      [`${entityType}.${dataField}`]: currentValue,
      ...originalValues
    }));
  }

  const monacoDiffEditor = useRef<MonacoDiffEditor>(null);
  const monacoStandaloneEditor = useRef<monacoEditor.editor.IStandaloneCodeEditor>(null);

  const editorOptions = useMemo(() => ({
    lineHeight: 20,
    scrollBeyondLastLine: false,
    formatOnPaste: true,
    formatOnType: true,
    tabSize: indentSize
  }), [indentSize]);

  const openApiUtil = useMemo(() => new OpenAPIUtil({
    document: openApiDocs
  }), [openApiDocs]);

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

  const isConfigEqual = React.useMemo(() => currentValue === originalValue, [currentValue, originalValue]);

  const formatDocument = useCallback(async () => {
    if (!monacoStandaloneEditor.current) {
      return;
    }

    const formatDocumentAction = monacoStandaloneEditor.current.getAction('editor.action.formatDocument');

    if (!formatDocumentAction) {
      return;
    }

    await formatDocumentAction.run();
  }, []);

  const diffOnMount = useCallback(async (
    editor: monacoEditor.editor.IStandaloneDiffEditor
  ) => {
    monacoDiffEditor.current = editor;

    await formatDocument();

    setIsFormattedInitially(true);
  }, [formatDocument]);

  const onMount = useCallback(async (editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    monacoStandaloneEditor.current = editor;

    await formatDocument();

    setIsFormattedInitially(true);
  }, [formatDocument]);

  const onFormatDocumentClick = async () => {
    await formatDocument();
  };

  const onChange: OnChange = (val?: string) => {
    setCurrentValue(val);

    if (!isFormattedInitially) {
      return;
    }

    if (_isNil(val)) {
      onChangeProp?.();
      return;
    }
    try {
      const jsonObject = JSON.parse(val);
      onChangeProp?.(jsonObject);
    } catch (error) {
      if (val.length === 0) {
        onChangeProp?.();
      }
      Logger.trace('JSON-Editor: ', error);
    }
  };

  return (
    <FullscreenWrapper>
      <div
        className="json-editor"
      >
        <div
          className="json-editor-toolbar"
        >
          <Tooltip
            title={t('JSONEditor.formatDocumentTooltip')}
          >
            <Button
              onClick={onFormatDocumentClick}
              icon={<MenuUnfoldOutlined />}
            />
          </Tooltip>
          <CopyToClipboardButton
            value={currentValue}
          />
        </div>
        {
          (isConfigEqual || !historyEnabled) ? (
            <Editor
              onMount={onMount}
              value={currentValue}
              onChange={onChange}
              path={
                openApiUtil.getPropertyRefName(entityType, dataField) ?
                  `${openApiUtil.getPropertyRefName(entityType, dataField)}.json` :
                  undefined
              }
              language="json"
              options={editorOptions}
              {...editorProps}
            />
          ) : (
            <DiffEditor
              onMount={diffOnMount}
              original={originalValue}
              modified={currentValue}
              language="json"
              keepCurrentOriginalModel
              keepCurrentModifiedModel
              options={{
                originalEditable: false,
                readOnly: true,
                renderSideBySide: false
              }}
            />
          )
        }
      </div>
    </FullscreenWrapper>
  );
};

export default JSONEditor;
