import { InformationModalTableDataType } from './types';

export const getDocExample = (schema, entity: string, property: string ): any => {
  if (schema.definitions[entity] && !!schema.definitions[entity].properties) {
    return JSON.stringify(schema.definitions[entity].properties[property].example, null, 2);
  }
  return undefined;
}


export const  getDocDescription = (schema, entity: string, property: string): string => {
  if (
    schema.definitions[entity] &&
    !!schema.definitions[entity].properties &&
    schema.definitions[entity].properties[property] &&
    !!schema.definitions[entity].properties[property].description
  ) {
    return schema.definitions[entity].properties[property].description;
  }
  return '';
};

export const getDocDataforTable = (schema, entity: string): InformationModalTableDataType[] | undefined=> {
  if (schema.definitions[entity] && !!schema.definitions[entity].properties) {
    return Object.keys(schema.definitions[entity].properties).map((key, index) => {
      const finalSchema: InformationModalTableDataType = {
        keyId: `${key}-${index}`,
        propertyName: key,
        description: schema.definitions[entity].properties[key].description,
        example: String(schema.definitions[entity].properties[key].example),
        dataType: schema.definitions[entity].properties[key].type,
        required: String(!!schema.definitions[entity].required && schema.definitions[entity].required.includes(key)),
        subProps: undefined
      };

      // TODO: Sometimes the "properties" contains a "$ref" key. But sometimes, this "$key" does not exist directly in
      // "properties". It exists inside another key called "items". This should be normalised
      let splitedRef;
      if (schema.definitions[entity].properties[key].$ref) {
        splitedRef = schema.definitions[entity].properties[key].$ref?.split('/');
      }
      if (schema.definitions[entity].properties[key].items) {
        splitedRef = schema.definitions[entity].properties[key].items.$ref?.split('/');
      }
      if (splitedRef) {
        const entityName = splitedRef[splitedRef.length -1];
        // avoid infinite recursion if the subProp object is the same as the main entity (for instance LayerTree)
        if (entity !== entityName) {
          finalSchema.subProps = getDocDataforTable(schema, entityName);
        } else {
          delete finalSchema.subProps;
        }
      }
      return finalSchema;
    });
  }
  return undefined;
};
