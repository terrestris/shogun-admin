import { getBearerTokenHeader } from '@terrestris/shogun-util/dist/security/getBearerTokenHeader';
import Keycloak from 'keycloak-js';

export type GraphQLQueryVariables = {
  [key: string]: any;
};

export type GraphQLServiceConstructorArgs = {
  url: string;
  keycloak: Keycloak;
};

export class GraphQLService {
  private keycloak?: Keycloak;
  url: string;

  constructor(args: GraphQLServiceConstructorArgs) {
    this.url = args.url;
    this.keycloak = args.keycloak;
  }

  async sendQuery(query: string, variables?: GraphQLQueryVariables, signal?: AbortSignal): Promise<any> {
    const reqOpts: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getBearerTokenHeader(this.keycloak)
      },
      body: JSON.stringify({
        query,
        variables
      }),
      signal
    };
    const response = await fetch(`${this.url}`, reqOpts);
    const { data, errors } = await response.json();
    // TODO: just return response json, data gets lost on multiquery
    if (errors?.length > 0) {
      throw errors;
    }
    return data;
  }

}
