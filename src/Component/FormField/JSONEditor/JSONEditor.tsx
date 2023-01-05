import React, {
  useEffect,
  useState
} from 'react';

import Editor, {
  EditorProps,
  Monaco
} from '@monaco-editor/react';

import Logger from 'js-logger';

import {
  OpenAPIV3
} from 'openapi-types';

import {
  JSONSchema7,
  JSONSchema7Definition,
  validate
} from 'json-schema';

import cloneDeep from 'lodash/cloneDeep';

import FullscreenWrapper from '../../FullscreenWrapper/FullscreenWrapper';

import {
  swaggerDocs
} from '../../../State/static';

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
};

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange,
  editorProps,
  entityType,
  dataField
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
    const entry = Object.entries(swaggerDocs.components.schemas)
      .find(([definitionKey]) => definitionKey.toLowerCase() === entityType.toLowerCase());

    if (!entry) {
      Logger.warn(`The entity definition for ${entityType} does not exist `+
        'in the OpenAPI specification');

      return undefined;
    }

    return entry[1];
  };

  const getDataTypeDefinition = () => {
    const entityTypeDefinition = getEntityTypeDefinition();

    if (!entityTypeDefinition) {
      return undefined;
    }

    const schemaObject = entityTypeDefinition as OpenAPIV3.SchemaObject;

    if (!schemaObject.properties || !schemaObject.properties[dataField]) {
      Logger.warn(`The property definition ${dataField} for ${entityType} ` +
        'does not exist in the OpenAPI specification');

      return undefined;
    }

    return schemaObject.properties[dataField];
  };

  const getEntityName = (): string => {
    const dataFieldDefinition = getDataTypeDefinition();

    if (Object.hasOwn(dataFieldDefinition, '$ref')) {
      return getRefName(dataFieldDefinition as OpenAPIV3.ReferenceObject);
    }

    if (Object.hasOwn(dataFieldDefinition, 'items')) {
      const schemaObject = dataFieldDefinition as OpenAPIV3.ArraySchemaObject;

      if (Object.hasOwn(schemaObject.items, '$ref')) {
        return getRefName(schemaObject.items as OpenAPIV3.ReferenceObject);
      }
    }

    return dataField;
  };

  const getRefName = (definition: OpenAPIV3.ReferenceObject) => {
    const splitParts = definition.$ref?.split('/');

    return splitParts[splitParts.length - 1];
  };

  const getEntityType = (): string => {
    const dataFieldDefinition = getDataTypeDefinition();

    if (Object.hasOwn(dataFieldDefinition, 'type')) {
      return (dataFieldDefinition as OpenAPIV3.SchemaObject).type;
    }

    return 'object';
  };

  const replaceRefs = (definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => {
    if (Object.hasOwn(definition, '$ref')) {
      replaceRef(definition as OpenAPIV3.ReferenceObject);
    } else {
      const schemaObject = definition as OpenAPIV3.SchemaObject;
      const type = schemaObject.type;

      if (schemaObject.properties) {
        Object.values(schemaObject.properties).forEach(property => {
          replaceRefs(property);
        });
      }

      if (schemaObject.allOf) {
        schemaObject.allOf.forEach(def => {
          replaceRefs(def);
        });
      }

      if (schemaObject.anyOf) {
        schemaObject.anyOf.forEach(def => {
          replaceRefs(def);
        });
      }

      if (schemaObject.oneOf) {
        schemaObject.oneOf.forEach(def => {
          replaceRefs(def);
        });
      }

      if (schemaObject.not) {
        replaceRefs(schemaObject.not);
      }

      if (type === 'array') {
        replaceRefs(schemaObject.items);
      }
    }
  };

  const replaceRef = (referenceObject: OpenAPIV3.ReferenceObject) => {
    const splitParts = referenceObject.$ref.split('/');
    referenceObject.$ref = `#/definitions/${splitParts[splitParts.length - 1]}`;
  };

  const createDefinitions = (): JSONSchemaDefinition => {
    const definitions: JSONSchemaDefinition = {};

    for (const schemaName in swaggerDocs.components.schemas) {
      // Ignore the revision types, e.g. Revisions«int,Application»
      if (schemaName.match(/^(.+)«(.+)»$/)) {
        continue;
      }

      let definition = cloneDeep(swaggerDocs.components.schemas[schemaName]);

      replaceRefs(definition);

      definitions[schemaName] = definition as JSONSchema7;
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
    <FullscreenWrapper>
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
