export type GraphQLQueryVariables = {
  [key: string]: any;
};

export type GraphQLServiceConstructorArgs = {
  url: string;
};

export class GraphQLService {
  url: string;

  constructor(args: GraphQLServiceConstructorArgs) {
    this.url = args.url;
  }

  async sendQuery(query: string, variables?: GraphQLQueryVariables, signal?: AbortSignal): Promise<any> {
    const reqOpts: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
