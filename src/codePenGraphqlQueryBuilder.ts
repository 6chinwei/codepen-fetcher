import type { FetchPensOptions, GraphqlFields } from './types';

export default class CodePenGraphqlQueryBuilder {
  public static readonly DEFAULT_FETCH_LIMIT = 10;
  public static readonly CODEPEN_OBJECT_TYPES = {
    USER: 'User',
  };

  protected static readonly PEN_FIELDS: GraphqlFields = {
    access: true,
    config: {
      css: true,
      cssPreProcessor: true,
      head: true,
      html: true,
      js: true,
      jsPreProcessor: true,
    },
    createdAt: true,
    description: {
      source: {
        body: true,
      },
    },
    id: true,
    owner: {
      id: true,
      username: true,
    },
    tags: true,
    title: true,
    updatedAt: true,
    url: true,
  };

  protected static readonly USER_PROFILE_FIELDS: GraphqlFields = {
    avatar: true,
    bio: true,
    counts: {
      followers: true,
      following: true,
      pens: true,
    },
    id: true,
    location: true,
    name: true,
    pro: true,
    username: true,
  };

  public buildGetPenByIdQuery(penId: string): string {
    return this.buildQuery({
      operation: 'pen',
      args: `(id: "${penId}")`,
      fields: CodePenGraphqlQueryBuilder.PEN_FIELDS
    });
  }

  public buildGetPensByUserIdQuery(userId: string, options?: FetchPensOptions): string {
    const args = `(input: { filters: { userId: "${userId}" }, pagination: { ${this.buildPaginationArgs(options)} } })`;

    return this.buildQuery({
      operation: 'pens',
      args,
      fields: { pens: CodePenGraphqlQueryBuilder.PEN_FIELDS }
    });
  }

  protected buildPaginationArgs(options?: FetchPensOptions): string {
    const {
      cursor,
      limit = CodePenGraphqlQueryBuilder.DEFAULT_FETCH_LIMIT,
      sortBy,
      sortOrder
    } = options ?? {};

    const args: string[] = [];

    if (cursor) {
      args.push(this.formatArg('cursor', cursor, true)); // Need to be quoted
    }

    args.push(this.formatArg('limit', limit));

    if (sortBy) {
      args.push(this.formatArg('sortBy', sortBy));
    }

    if (sortOrder) {
      args.push(this.formatArg('sortOrder', sortOrder));
    }

    return args.join(', ');
  }

  protected formatArg(key: string, value: string | number, quoted: boolean = false): string {
    return quoted ? `${key}: "${value}"` : `${key}: ${value}`;
  }

  public buildGetProfileByUsernameQuery(username: string): string {
    return this.buildQuery({
      operation: 'ownerByUsername',
      args: `(ownerUsername: "${username}", ownerType: ${CodePenGraphqlQueryBuilder.CODEPEN_OBJECT_TYPES.USER})`,
      fields: CodePenGraphqlQueryBuilder.USER_PROFILE_FIELDS
    });
  }

  /**
   * Return a inline GraphQL query string
   *
   * @param operation - The GraphQL operation name (e.g. "pen", "pens", "ownerByUsername").
   * @param args - The argument string to include in the query (e.g. `(id: "123")`).
   * @param fields - An object representing fields.
   *
   * @returns A JSON stringified inline GraphQL query.
   */
  protected buildQuery({
    operation,
    args,
    fields
  }: {
    operation: string;
    args: string;
    fields: GraphqlFields;
  }): string {
    return JSON.stringify({
      query: `query { ${operation} ${args} { ${this.buildFields(fields)} }}`
    });
  }

  protected buildFields(fields: GraphqlFields): string {
    return Object.entries(fields)
      .map(([key, value]) => {
        if (value === true) {
          return key;
        }

        return `${key} { ${this.buildFields(value as GraphqlFields)} }`;
      })
      .join(' ');
  }
}
