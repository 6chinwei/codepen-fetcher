import type { CodePenApi, Pen, FetchPensOptions, UserProfile, GetPenResponse, GetProfileResponse, GetPensResponse, GraphqlPayload } from './types';
import ApiRequestHeaders from './codePenApiRequestHeaders';
import QueryBuilder from './codePenGraphqlQueryBuilder';

export default class CodePenGraphqlApi implements CodePenApi {
  protected static readonly API_URL = 'https://codepen.io/graphql';

  protected apiRequestHeaders: ApiRequestHeaders;
  protected apiQueryBuilder: QueryBuilder;

  constructor (
    apiRequestHeaders: ApiRequestHeaders,
    apiQueryBuilder: QueryBuilder
  ) {
    this.apiRequestHeaders = apiRequestHeaders;
    this.apiQueryBuilder = apiQueryBuilder;
  }

  public async init(): Promise<CodePenGraphqlApi> {
    await this.apiRequestHeaders.setupCsrfHeaders();

    return this;
  }

  /**
   * Executes a GraphQL query with the provided query.
   *
   * @template T - The expected return type of the GraphQL query.
   * @param payload - The GraphQL query payload.
   * @returns A promise that resolves to the result.
   * @throws Throws an error if the fetch operation fails.
   */
  protected async executeGraphqlQuery<T> (payload: GraphqlPayload): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
      headers: this.apiRequestHeaders,
      body: JSON.stringify(payload),
      redirect: 'follow'
    };

    try {
      const response = await fetch(CodePenGraphqlApi.API_URL, options);
      const data = await response.json() as T;

      return data;
    } catch (error) {
      console.error('Fetch error:', error);

      throw new Error('Failed to fetch data');
    }
  }

  public async getPenById (penId: string): Promise<Pen> {
    const payload = {
      query: this.apiQueryBuilder.buildGetPenByIdQuery(penId)
    };
    const result = await this.executeGraphqlQuery<GetPenResponse>(payload);

    return result.data.pen;
  }

  public async getProfileByUsername (username: string): Promise<UserProfile> {
    const payload = {
      query: this.apiQueryBuilder.buildGetProfileByUsernameQuery(username)
    };
    const result = await this.executeGraphqlQuery<GetProfileResponse>(payload);

    return result.data.ownerByUsername;
  }

  public async getPensByUserId (userId: string, options?: FetchPensOptions): Promise<Pen[]> {
    const payload = {
      query: this.apiQueryBuilder.buildGetPensByUserIdQuery(userId, options)
    };
    const result = await this.executeGraphqlQuery<GetPensResponse>(payload);

    return result.data.pens.pens;
  }
}
