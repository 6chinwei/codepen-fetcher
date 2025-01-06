import { query as buildQuery } from 'gql-query-builder';
import { FetchPensOptions } from './types';

export default class CodePenGraphqlQueryBuilder {
  /**
   * @return The pen fields you want to retrieve from the GraphQL API
   */
  protected getPenFields (): Array<string | object> {
    return [
      'access',
      {
        'config': [
          'css',
          'cssPreProcessor',
          'head',
          'html',
          'js',
          'jsPreProcessor'
        ]
      },
      'createdAt',
      { 'description': [{ 'source' : ['body'] }] },
      'id',
      { 'owner': ['id', 'username'] },
      'tags',
      'title',
      'updatedAt',
      'url',
    ];
  }

  /**
   * @return The user profile fields you want to retrieve from the GraphQL API
   */
  protected getUserProfileFields (): Array<string | object> {
    return [
      'avatar',
      'bio',
      {
        'counts': ['followers', 'following', 'pens']
      },
      'id',
      'location',
      'name',
      'pro',
      'username',
    ];
  }

  public buildGetPenByIdQuery (penId: string): string {
    const query = buildQuery({
      operation: 'pen',
      variables: {
        id: { value: penId, type: 'ID', required: true }
      },
      fields: this.getPenFields()
    }, null, { operationName: 'getPenById' });

    return JSON.stringify(query);
  }

  public buildGetPensByUserIdQuery (userId: string, options: FetchPensOptions = {}): string {
    const query = buildQuery({
      operation: 'pens',
      variables: {
        input: this.buildPensInput(userId, options)
      },
      fields: [{
        pens: this.getPenFields()
      }]
    }, null, { operationName: 'getPensByUserId' });

    return JSON.stringify(query);
  }

  protected buildPensInput (userId: string, options : FetchPensOptions = {}): Record<string, string | boolean | object> {
    return {
      value: {
        filters: {
          userId
        },
        pagination: {
          cursor: options.cursor,
          limit: options?.limit ?? 10,
          sortBy: options.sortBy,
          sortOrder: options.sortOrder
        }
      },
      type: 'PensInput',
      required: true
    };
  }

  public buildGetProfileByUsernameQuery (username: string): string {
    const query = buildQuery({
      operation: 'ownerByUsername',
      variables: {
        ownerUsername: { value: username, type: 'String', required: true },
        ownerType: { value: 'User', type: 'OwnerEnum', required: true }
      },
      fields: this.getUserProfileFields()
    }, null, { operationName: 'getProfileByUsername' });

    return JSON.stringify(query);
  }
}
