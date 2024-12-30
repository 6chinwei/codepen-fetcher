import { Pen, FetchPensOptions, UserProfile, GetPenResponse, GetProfileResponse, GetPensResponse } from './types';

export default class CodePenGraphqlApi {
  private static readonly DEFAULT_API_URL = 'https://codepen.io/graphql';
  private static readonly DEFAULT_INDEX_URL = 'https://codepen.io/';

  private apiUrl: string;
  private indexUrl: string;
  private headers: HeadersInit;
  private penFields: string;

  constructor(config: { apiUrl?: string, indexUrl?: string } = {}) {
    this.apiUrl = config.apiUrl ?? CodePenGraphqlApi.DEFAULT_API_URL;
    this.indexUrl = config.indexUrl ?? CodePenGraphqlApi.DEFAULT_INDEX_URL;
    this.headers = {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
    this.penFields = `
      access
      config {
        css
        cssPreProcessor
        head
        html
        js
        jsPreProcessor
      }
      createdAt
      description {
        source {
          body
        }
      }
      id
      owner {
        id
        username
      }
      tags
      title
      updatedAt
      url`;
  }

  public async init(): Promise<CodePenGraphqlApi> {
    await this.setupCsrfHeaders();

    return this;
  }

  /**
   * Setup CSRF headers for subsequent requests.
   *
   * This method sends a request to the CodePen index URL
   * to retrieve the CSRF token and cookie.
   */
  protected async setupCsrfHeaders(): Promise<void> {
    const headers = {
      'Accept': 'text/html',
      'Upgrade-Insecure-Requests': '1',
    };

    const response = await fetch(this.indexUrl, { headers });
    const csrfToken = await this.findCsrfToken(response);
    const csrfCookie = this.findCsrfCookie(response);

    this.headers = {
      ...this.headers,
      'X-Csrf-Token': csrfToken,
      'Cookie': csrfCookie,
    };
  }

  protected async findCsrfToken(response: Response): Promise<string> {
    const html = await response.text();
    const [, token] = (/<meta name="csrf-token"\s+content="([^"]+)"/.exec(html)) ?? [];

    if (!token) {
      throw new Error('CSRF token not found');
    }

    return token;
  }

  protected findCsrfCookie(response: Response): string {
    const cookieName = 'cp_session';
    const cookieHeader = response.headers.get('set-cookie')?.split(',') ?? [];
    const cookie = cookieHeader.find(cookie => cookie.startsWith(`${cookieName}=`))?.split(';')[0];

    if (!cookie) {
      throw new Error('CSRF cookie not found');
    }

    return cookie;
  }


  /**
   * Executes a GraphQL query with the provided query string and variables.
   *
   * @template T - The expected return type of the GraphQL query.
   * @param {string} query - The GraphQL query string.
   * @param {Record<string, unknown>} variables - The variables to be used in the GraphQL query.
   * @returns A promise that resolves to the result of the GraphQL query.
   * @throws Throws an error if the fetch operation fails.
   */
  protected async executeGraphqlQuery<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query, variables }),
      redirect: 'follow'
    };

    try {
      const response = await fetch(this.apiUrl, options);
      const data = await response.json() as T;

      return data;
    } catch (error) {
      console.error('Fetch error:', error);

      throw new Error('Failed to fetch data');
    }
  }

  public async getPenById(penId: string): Promise<Pen> {
    const variables = { penId };
    const query = `query getPenById ($penId: ID!) {
          pen(id: $penId) {${this.penFields}}
        }`;
    const result = await this.executeGraphqlQuery<GetPenResponse>(query, variables);

    return result.data.pen;
  }

  public async getPensByUserId(userId: string, options: FetchPensOptions = {}): Promise<Pen[]> {
    const variables = {
      input: {
        filters: {
          userId
        },
        pagination: {
          cursor: options?.cursor ?? undefined,
          limit: options?.limit ?? 10,
          sortBy: options?.sortBy ?? undefined,
          sortOrder: options?.sortOrder ?? undefined
        }
      }
    };
    const query = `query getPensByUserId ($input: PensInput!) {
        pens(input: $input) {
          pens {${this.penFields}}
        }
      }`;
    const result = await this.executeGraphqlQuery<GetPensResponse>(query, variables);

    return result.data.pens.pens;
  }

  public async getProfileByUsername(username: string): Promise<UserProfile> {
    const variables = { username };
    const query = `query getProfileByUsername ($username: String!) {
        ownerByUsername(ownerUsername: $username, ownerType: User) {
          avatar
          bio
          counts {
            followers
            following
            pens
          }
          id
          location
          name
          pro
          username
        }
      }`;
    const result = await this.executeGraphqlQuery<GetProfileResponse>(query, variables);

    return result.data.ownerByUsername;
  }
}
