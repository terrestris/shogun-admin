import Logger from 'js-logger';
import {
  JSONSchema7,
  JSONSchema7Definition,
  validate,
  ValidationResult
} from 'json-schema';
import cloneDeep from 'lodash/cloneDeep';
import _isNil from 'lodash/isNil';
import {
  OpenAPIV3
} from 'openapi-types';

export type JSONSchemaDefinition = Record<string, JSONSchema7Definition>;

export interface OpenAPIUtilOpts {
  document: OpenAPIV3.Document;
}

export class OpenAPIUtil {

  private document: OpenAPIV3.Document;

  constructor(opts: OpenAPIUtilOpts) {
    this.document = opts.document;
  };

  getEntityDefinition = (entity: string) => {
    if (_isNil(this.document?.components?.schemas)) {
      return undefined;
    }
    const entry = Object.entries(this.document?.components?.schemas ?? {})
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

    if (_isNil(propertyDefinition)) {
      return;
    }

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

  getPropertyType = (entity: string, property: string): string | undefined => {
    const propertyDefinition = this.getPropertyDefinition(entity, property);

    if (_isNil(propertyDefinition)) {
      return;
    }

    if (Object.hasOwn(propertyDefinition, 'type')) {
      return (propertyDefinition as OpenAPIV3.SchemaObject).type;
    }

    return 'object';
  };

  getJSONSchemaFromDocument = (schemaName: string, entity: string, property: string): JSONSchema7 => {
    const schemaId = `http://shogun/shogun-schema-${schemaName.toLocaleLowerCase()}.json`;
    const schemaDialect = 'http://json-schema.org/2020-12/schema#';
    const definitions = this.createDefinitions();
    const type = this.getPropertyType(entity, property);

    let schema: JSONSchema7 = {
      $id: schemaId,
      $schema: schemaDialect,
      definitions: definitions
    };
    let isValid: ValidationResult | undefined = undefined;

    if (type === 'object' && !_isNil(definitions)) {
      schema = {
        ...schema,
        ...definitions[schemaName] as {}
      };
      isValid = validate({}, schema);
    }

    if (type === 'array' && !_isNil(definitions)) {
      schema.items = definitions[schemaName] as {};
      schema.type = 'array';
      isValid = validate([], schema);
    }

    if (_isNil(isValid) || !isValid?.valid) {
      Logger.error('Invalid JSON schema detected: ', isValid?.errors);
    }

    return schema;
  };

  private createDefinitions = (): JSONSchemaDefinition | undefined => {
    const definitions: JSONSchemaDefinition = {};
    if (_isNil(this.document?.components?.schemas)) {
      return undefined;
    }

    for (const schemaName in this.document?.components?.schemas) {
      // Ignore the revision types, e.g. Revisions«int,Application»
      if (schemaName.match(/^(.+)«(.+)»$/)) {
        continue;
      }

      const definition = cloneDeep(this.document.components.schemas[schemaName]);

      this.replaceRefs(definition);
      this.applyDiscriminator(definition);

      definitions[schemaName] = definition as JSONSchema7;
    }

    return definitions;
  };

  private getRefName = (definition: OpenAPIV3.ReferenceObject) => {
    const splitParts = definition.$ref?.split('/');

    return splitParts[splitParts.length - 1];
  };

  private replaceRefs = (definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => {
    const replace = (def: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => {
      if (Object.hasOwn(def, '$ref')) {
        this.replaceRef(def as OpenAPIV3.ReferenceObject);
      }
    };

    this.walkSchemaDefinition(definition, replace);
  };

  private replaceRef = (referenceObject: OpenAPIV3.ReferenceObject) => {
    referenceObject.$ref = this.replaceRefString(referenceObject.$ref);
  };

  private replaceRefString = (reference: string) => {
    const splitParts = reference.split('/');
    return `#/definitions/${splitParts[splitParts.length - 1]}`;
  };

  private applyDiscriminator = (definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => {
    let discriminator: OpenAPIV3.DiscriminatorObject | null;

    const findDiscriminator = (def: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => {
      if (Object.hasOwn(def, '$ref')) {
        const referenceObject = def as OpenAPIV3.ReferenceObject;
        const nextDef = this.getEntityDefinition(this.getRefName(referenceObject));
        if (!_isNil(nextDef)) {
          this.walkSchemaDefinition(nextDef, findDiscriminator);
        } else {
          Logger.warn(`Schema definition of ${def} is not defined.`);
        }
      } else {
        const schemaObject = def as OpenAPIV3.SchemaObject;

        if (schemaObject.discriminator) {
          discriminator = schemaObject.discriminator;
        }
      }
    };

    const findOneOf = (def: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => {
      if (Object.hasOwn(def, '$ref') || !Object.hasOwn(def, 'oneOf')) {
        return;
      }

      const schemaObject = def as OpenAPIV3.SchemaObject;
      if (_isNil(schemaObject?.oneOf)) {
        return;
      }

      const allOf: JSONSchema7Definition[] = [];

      for (const d of schemaObject.oneOf) {
        this.walkSchemaDefinition(d, findDiscriminator);

        if (!discriminator) {
          continue;
        }

        const discriminatorProperty = discriminator.propertyName;
        const discriminatorMapping = discriminator.mapping;

        if (!discriminatorMapping) {
          continue;
        }

        for (const [value, schema] of Object.entries(discriminatorMapping)) {
          const condition: any = {
            if: {
              properties: {},
              required: []
            },
            then: {
              $ref: undefined
            }
          };

          (condition.if.properties[discriminatorProperty] as JSONSchema7) = {};
          (condition.if.properties[discriminatorProperty] as JSONSchema7).const = value;
          if (!_isNil(condition?.if?.required)) {
            condition.if.required.push(discriminatorProperty);
          }
          (condition.then as JSONSchema7).$ref = this.replaceRefString(schema);

          allOf.push(condition);
        }
      }

      if (allOf.length > 0) {
        delete schemaObject.oneOf;
        // @ts-expect-error TODO type seems incompatible
        schemaObject.allOf = allOf;
      }
    };

    this.walkSchemaDefinition(definition, findOneOf);
  };

  private walkSchemaDefinition = (definition: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
    callback?: (def: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => void) => {

    if (callback) {
      callback(definition);
    }

    if (Object.hasOwn(definition, '$ref')) {
      return;
    }

    const schemaObject = definition as OpenAPIV3.SchemaObject;
    const type = schemaObject.type;

    if (schemaObject.properties) {
      for (const property of Object.values(schemaObject.properties)) {
        this.walkSchemaDefinition(property, callback);
      }
    }

    if (schemaObject.allOf) {
      for (const def of schemaObject.allOf) {
        this.walkSchemaDefinition(def, callback);
      }
    }

    if (schemaObject.anyOf) {
      for (const def of schemaObject.anyOf) {
        this.walkSchemaDefinition(def, callback);
      }
    }

    if (schemaObject.oneOf) {
      for (const def of schemaObject.oneOf) {
        this.walkSchemaDefinition(def, callback);
      }
    }

    if (schemaObject.not) {
      this.walkSchemaDefinition(schemaObject.not, callback);
    }

    if (type === 'array') {
      this.walkSchemaDefinition(schemaObject.items, callback);
    }
  };
}

export default OpenAPIUtil;
