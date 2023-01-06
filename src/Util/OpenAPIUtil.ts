import Logger from 'js-logger';

import {
  OpenAPIV3
} from 'openapi-types';

import {
  JSONSchema7,
  JSONSchema7Definition,
  validate,
  ValidationResult
} from 'json-schema';

import cloneDeep from 'lodash/cloneDeep';

export type JSONSchemaDefinition = {
  [key: string]: JSONSchema7Definition;
};

export type OpenAPIUtilOpts = {
  document: OpenAPIV3.Document;
};

export class OpenAPIUtil {

  private document: OpenAPIV3.Document;

  constructor(opts: OpenAPIUtilOpts) {
    this.document = opts.document;
  };

  getEntityDefinition = (entity: string) => {
    const entry = Object.entries(this.document.components.schemas)
      .find(([definitionKey]) => definitionKey.toLowerCase() === entity.toLowerCase());

    if (!entry) {
      Logger.warn(`The entity definition for ${entity} does not exist `+
        'in the OpenAPI specification');

      return undefined;
    }

    return entry[1];
  };

  getPropertyDefinition = (entity: string, property: string) => {
    const entityDefinition = this.getEntityDefinition(entity);

    if (!entityDefinition) {
      return undefined;
    }

    const schemaObject = entityDefinition as OpenAPIV3.SchemaObject;

    if (!schemaObject.properties || !schemaObject.properties[property]) {
      Logger.warn(`The property definition ${property} for ${entity} ` +
        'does not exist in the OpenAPI specification');

      return undefined;
    }

    return schemaObject.properties[property];
  };

  getPropertyRefName = (entity: string, property: string) => {
    const propertyDefinition = this.getPropertyDefinition(entity, property);

    if (Object.hasOwn(propertyDefinition, '$ref')) {
      return this.getRefName(propertyDefinition as OpenAPIV3.ReferenceObject);
    }

    if (Object.hasOwn(propertyDefinition, 'items')) {
      const schemaObject = propertyDefinition as OpenAPIV3.ArraySchemaObject;

      if (Object.hasOwn(schemaObject.items, '$ref')) {
        return this.getRefName(schemaObject.items as OpenAPIV3.ReferenceObject);
      }
    }

    return property;
  };

  getPropertyType = (entity: string, property: string): string => {
    const propertyDefinition = this.getPropertyDefinition(entity, property);

    if (Object.hasOwn(propertyDefinition, 'type')) {
      return (propertyDefinition as OpenAPIV3.SchemaObject).type;
    }

    return 'object';
  };

  getJSONSchemaFromDocument = (schemaName: string, entity: string, property: string): JSONSchema7 => {
    const schemaId = `http://shogun/shogun-schema-${schemaName.toLocaleLowerCase()}.json`;
    const schemaDialect = 'http://json-schema.org/draft-07/schema#';
    const definitions = this.createDefinitions();
    const type = this.getPropertyType(entity, property);

    let schema: JSONSchema7 = {
      $id: schemaId,
      $schema: schemaDialect,
      definitions: definitions
    };
    let isValid: ValidationResult;

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

  private createDefinitions = (): JSONSchemaDefinition => {
    const definitions: JSONSchemaDefinition = {};

    for (const schemaName in this.document.components.schemas) {
      // Ignore the revision types, e.g. Revisions«int,Application»
      if (schemaName.match(/^(.+)«(.+)»$/)) {
        continue;
      }

      let definition = cloneDeep(this.document.components.schemas[schemaName]);

      this.replaceRefs(definition);

      definitions[schemaName] = definition as JSONSchema7;
    }

    return definitions;
  };

  private getRefName = (definition: OpenAPIV3.ReferenceObject) => {
    const splitParts = definition.$ref?.split('/');

    return splitParts[splitParts.length - 1];
  };

  private replaceRefs = (definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => {
    if (Object.hasOwn(definition, '$ref')) {
      this.replaceRef(definition as OpenAPIV3.ReferenceObject);
    } else {
      const schemaObject = definition as OpenAPIV3.SchemaObject;
      const type = schemaObject.type;

      if (schemaObject.properties) {
        Object.values(schemaObject.properties).forEach(property => {
          this.replaceRefs(property);
        });
      }

      if (schemaObject.allOf) {
        schemaObject.allOf.forEach(def => {
          this.replaceRefs(def);
        });
      }

      if (schemaObject.anyOf) {
        schemaObject.anyOf.forEach(def => {
          this.replaceRefs(def);
        });
      }

      if (schemaObject.oneOf) {
        schemaObject.oneOf.forEach(def => {
          this.replaceRefs(def);
        });
      }

      if (schemaObject.not) {
        this.replaceRefs(schemaObject.not);
      }

      if (type === 'array') {
        this.replaceRefs(schemaObject.items);
      }
    }
  };

  private replaceRef = (referenceObject: OpenAPIV3.ReferenceObject) => {
    const splitParts = referenceObject.$ref.split('/');
    referenceObject.$ref = `#/definitions/${splitParts[splitParts.length - 1]}`;
  };
}

export default OpenAPIUtil;
