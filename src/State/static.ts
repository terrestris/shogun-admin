import Logger from 'js-logger';
import { SwaggerDocs } from '@terrestris/shogun-util/dist/service/OpenAPIService';

export let swaggerDocs: SwaggerDocs;

export const setSwaggerDocs = (docs: SwaggerDocs) => {
  if (!swaggerDocs) {
    swaggerDocs = docs;
  } else {
    Logger.warn('Attemp to set static swagger docs denied.');
  }
};
