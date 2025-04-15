import type { FetchPensOptions, GraphqlVariable, GraphqlQueryOptions } from './types';

const CodePenGraphqlTypes = {
  Id: 'ID',
  String: 'String',
  OwnerEnum: 'OwnerEnum',
  User: 'User',
  PensInput: 'PensInput',
} as const;

export default class CodePenGraphqlQueryBuilder {
  protected static readonly PEN_FIELDS: Array<string | object> = [
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

  protected static readonly USER_PROFILE_FIELDS: Array<string | object> = [
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

  public buildGetPenByIdQuery (penId: string): string {
    return this.buildQuery({
      operation: 'pen',
      fields: CodePenGraphqlQueryBuilder.PEN_FIELDS,
      variables: {
        id: {
          value: penId,
          type: CodePenGraphqlTypes.Id
        }
      }
    });
  }

  public buildGetPensByUserIdQuery (userId: string, options: FetchPensOptions = { limit: 10 }): string {
    return this.buildQuery({
      operation: 'pens',
      fields: [{
        pens: CodePenGraphqlQueryBuilder.PEN_FIELDS
      }],
      variables: {
        input: {
          value: {
            filters: {
              userId
            },
            pagination: options
          },
          type: CodePenGraphqlTypes.PensInput
        }
      }
    });
  }

  public buildGetProfileByUsernameQuery (username: string): string {
    return this.buildQuery({
      operation: 'ownerByUsername',
      fields: CodePenGraphqlQueryBuilder.USER_PROFILE_FIELDS,
      variables: {
        ownerUsername: {
          value: username,
          type: CodePenGraphqlTypes.String
        },
        ownerType: {
          value: CodePenGraphqlTypes.User,
          type: CodePenGraphqlTypes.OwnerEnum
        }
      }
    });
  }

  /**
   * Return a GraphQL query string with variables.
   *
   * @param operation - The name of the root GraphQL operation to query.
   * @param fields - The fields to retrieve from the operation.
   * @param variables - Optional GraphQL variables used in the query.
   *
   * @returns A stringified JSON object containing the GraphQL query and variables.
   *
   * @example
   * buildQuery({
   *     operation: 'pen',
   *     fields: ['id', 'title'],
   *     variables: {
   *         id: { value: '123', type: CodePenGraphqlTypes.ID }
   *     }
   * });
   */
  protected buildQuery({
    operation,
    fields,
    variables
  }: GraphqlQueryOptions): string {
    const variableDefinitions = this.buildVariableDefinitions(variables);
    const variableAssignments = this.buildVariableAssignments(variables);

    const query = `
      query ${variableDefinitions} {
        ${operation} ${variableAssignments} {
          ${this.buildFields(fields)}
        }
      }
    `;

    const variableValues = variables
      ? Object.entries(variables).reduce((acc, [key, val]) => {
        acc[key] = val.value;

        return acc;
      }, {} as Record<string, unknown>)
      : undefined;

    return JSON.stringify({
      query: query.replace(/\s+/g, ' ').trim(),
      variables: variableValues
    });
  }

  protected buildVariableDefinitions(variables?: Record<string, GraphqlVariable>): string {
    if (!variables || Object.keys(variables).length === 0) {
      return '';
    }

    const defs = Object.entries(variables)
      .map(([key, { type, required = true }]) => `$${key}: ${type}${required ? '!' : ''}`)
      .join(', ');

    return `(${defs})`;
  }

  protected buildVariableAssignments(variables?: Record<string, GraphqlVariable>): string {
    if (!variables || Object.keys(variables).length === 0) {
      return '';
    }

    const assigns = Object.keys(variables)
      .map(key => `${key}: $${key}`)
      .join(', ');

    return `(${assigns})`;
  }

  protected buildFields(fields: Array<string | object>): string {
    return fields
      .map(field => {
        if (typeof field === 'string') {
          return field;
        }
        if (typeof field === 'object') {
          return Object.entries(field)
            .map(([key, value]) => `${key} { ${this.buildFields(value as Array<string | object>)} }`)
            .join('\n');
        }

        return '';
      })
      .join('\n');
  }
}
