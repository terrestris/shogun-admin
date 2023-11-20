import Logger from 'js-logger';
import {
  OpenAPIV3
} from 'openapi-types';

export let swaggerDocs: OpenAPIV3.Document;

export const setSwaggerDocs = (docs: OpenAPIV3.Document) => {
  if (!swaggerDocs) {
    swaggerDocs = docs;
  } else {
    Logger.warn('Attemp to set static swagger docs denied.');
  }
};
