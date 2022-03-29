import config from 'shogunApplicationConfig';
import CsrfUtil from '@terrestris/base-util/dist/CsrfUtil/CsrfUtil';

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
    const reqOpts: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': CsrfUtil.getCsrfValueFromCookie()
      },
      body: JSON.stringify(query)
    };
    return fetch(`${config.path.graphql}`, reqOpts)
      .then(response => response.json());
  }
}

export default GraphQLService;
