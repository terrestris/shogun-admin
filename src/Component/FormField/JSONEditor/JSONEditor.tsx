import React, {
  useEffect,
  useState
} from 'react';
import Editor, { EditorProps, Monaco } from '@monaco-editor/react';
import Logger from 'js-logger';
import FullscreenWrapper from '../../FullscreenWrapper/FullscreenWrapper';

import cloneDeep from 'lodash/cloneDeep';

import { JSONSchema7, JSONSchema7Definition, validate } from 'json-schema';

import { swaggerDocs } from '../../../State/static';

import './JSONEditor.less';

type JSONSchemaDefinition = {
  [key: string]: JSONSchema7Definition;
};

export type JSONEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  editorProps?: EditorProps;
  entityType: string;
  dataField: string;
  showInformationButton?: boolean;
};

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange,
  editorProps,
  entityType,
  dataField,
  showInformationButton = false
}) => {
  const [currentValue, setCurrentValue] = useState<string>();

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

  const changeHandler = (val: string) => {
    try {
      const jsonObject = JSON.parse(val);
      onChange(jsonObject);
    } catch (error) {
      if (val.length === 0) {
        onChange(null);
      }
      Logger.trace('JSON-Editor:', error);
    }
  };

  const getEntityTypeDefinition = () => {
    // TODO Enhance typing for swaggerDocs in shogun-util
    const entry = Object.entries(swaggerDocs.definitions)
      .find(([definitionKey]) => {
        return definitionKey.toLowerCase() === entityType.toLowerCase();
      });

    if (!entry) {
      Logger.warn(`The entity definition for ${entityType} does not exist `+
        'in the OpenAPI specification');
      return;
    }

    return entry[1];
  };

  const getDataTypeDefinition = () => {
    const entityTypeDefinition = getEntityTypeDefinition();

    if (!entityTypeDefinition || !(entityTypeDefinition.properties &&
        entityTypeDefinition.properties[dataField])) {
      Logger.warn(`The property definition ${dataField} for ${entityType} ` +
        'does not exist in the OpenAPI specification');
      return;
    }

    return entityTypeDefinition.properties[dataField];
  };

  const getEntityName = (): string => {
    const dataFieldDefinition = getDataTypeDefinition();

    if (dataFieldDefinition.type === 'array' && dataFieldDefinition.items?.$ref) {
      const splitParts = dataFieldDefinition.items.$ref?.split('/');
      return splitParts[splitParts.length - 1] as string;
    }

    if (!dataFieldDefinition.type && dataFieldDefinition.$ref) {
      const splitParts = dataFieldDefinition.$ref.split('/');
      return splitParts[splitParts.length - 1] as string;
    }

    return dataField;
  };

  const getEntityType = (): string => {
    const dataFieldDefinition = getDataTypeDefinition();

    if (!dataFieldDefinition.type) {
      return 'object';
    }

    return dataFieldDefinition.type;
  };

  const createDefinitions = (): JSONSchemaDefinition => {
    const definitions: JSONSchemaDefinition = {};

    for (const schemaName in swaggerDocs.definitions) {
      // Ignore the revision types, e.g. Revisions«int,Application»
      if (schemaName.match(/^(.+)«(.+)»$/)) {
        continue;
      }

      let definition: JSONSchema7 = cloneDeep(swaggerDocs.definitions[schemaName]);

      if (definition.properties) {
        Object.values(definition.properties).forEach((property: any) => {
          if (property.type === 'object' && property.additionalProperties?.type === 'object') {
            delete property.additionalProperties;
          }
          if (property.$ref) {
            property.$ref = `${property.$ref}`;
          }
          if (property.items?.$ref) {
            property.items.$ref = `${property.items.$ref}`;
          }
        });
      }

      definitions[schemaName] = definition;
    }

    return definitions;
  };

  const getSchema = (schemaName: string): JSONSchema7 => {
    const schemaId = `http://shogun/shogun-schema-${schemaName.toLocaleLowerCase()}.json`;
    const schemaDialect = 'http://json-schema.org/draft-07/schema#';
    const definitions = createDefinitions();
    const type = getEntityType();

    let schema: JSONSchema7 = {
      $id: schemaId,
      $schema: schemaDialect,
      definitions: definitions
    };
    let isValid;

    if (type === 'object') {
      schema = {
        ...schema,
        ...definitions[schemaName] as {}
      };
      isValid = validate({}, schema);
    }

    if (type === 'array') {
      schema.items = definitions[schemaName] as {};
      schema.type = 'array';
      isValid = validate([], schema);
    }

    if (!isValid.valid) {
      Logger.error('Invalid JSON schema detected: ', isValid.errors);
    }

    return schema;
  };

  const setSchemaValidation = (monaco: Monaco) => {
    const entityName = getEntityName();
    const schema = getSchema(entityName);

    const schemas = [
      ...cloneDeep(monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas),
      {
        uri: schema.$id,
        fileMatch: [`${entityName}.json`],
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
  };

  const onEditorMount = (monaco: Monaco) => {
    setSchemaValidation(monaco);
  };

  return (
    <FullscreenWrapper
      showInformationButton={showInformationButton}
      dataField={dataField}
      entity={entityType}
    >
      <div className='json-editor'>
        <Editor
          value={currentValue}
          onChange={changeHandler}
          path={getEntityName() ? `${getEntityName()}.json` : undefined}
          language="json"
          beforeMount={onEditorMount}
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
