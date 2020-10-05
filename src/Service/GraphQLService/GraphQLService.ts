import config from 'shogunApplicationConfig';
import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';
import { keycloak } from '../../Util/KeyCloakUtil';

// TODO: Make this generic and more specific
export type GraphQLQueryObject = {
  query: string;
  variables?: {
    [key: string]: any;
  };
  operation?: null;
};

export type GraphQLRepsonse = {
  data: any;
};

class GraphQLService {

  clazz: string;

  async sendQuery(query: GraphQLQueryObject): Promise<GraphQLRepsonse> {

    if (!keycloak.token) {
      return Promise.reject('No keycloak token available');
    }

    const reqOpts: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie(),
        'Authorization': `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(query)
    };

    return fetch(`${config.paths.graphql.base}`, reqOpts)
      .then(response => response.json());
  }
}

export default GraphQLService;
