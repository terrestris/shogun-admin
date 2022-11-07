import { InformationModalTableDataType } from '../types';

export const getDocDataforTable = (schema, entity: string): InformationModalTableDataType[] => {
  if (schema.definitions[entity] && !!schema.definitions[entity].properties) {
    return Object.keys(schema.definitions[entity].properties).map(key => {
      const finalSchema = {
        propertyName: key,
        description: schema.definitions[entity].properties[key].description,
        example: schema.definitions[entity].properties[key].example,
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
  return [{
    propertyName: 'TODO',
    description: 'TODO',
    example: 'TODO',
    dataType: 'TODO',
    required: 'TODO'
  }];
};
