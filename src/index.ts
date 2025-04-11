import type { Pen, FetchPensOptions, UserProfile } from './types';
import CodePenGraphqlApi from './codePenGraphqlApi';
import ApiRequestHeaders from './codePenApiRequestHeaders';
import QueryBuilder from './codePenGraphqlQueryBuilder';

let codePenApi: CodePenGraphqlApi | undefined;

async function makeCodePenApi() {
  if (!codePenApi) {
    const apiRequestHeaders = new ApiRequestHeaders();
    const queryBuilder = new QueryBuilder();

    codePenApi = new CodePenGraphqlApi(apiRequestHeaders, queryBuilder);
    await codePenApi.init();
  }

  return codePenApi;
}

/**
 * Fetch a pen by its ID, which can be found in the URL of the pen.
 *
 * @param penId
 */
export async function fetchPen(penId: string): Promise<Pen> {
  return (await makeCodePenApi())
    .getPenById(penId);
};

/**
 * Fetch a user profile by username.
 *
 * @param username
 */
export async function fetchProfile(username: string): Promise<UserProfile> {
  return (await makeCodePenApi())
    .getProfileByUsername(username);
}

/**
 * Fetch pens created by a specific user.
 *
 * @param userId
 * @param options
 */
export async function fetchPensByUserId(userId: string, options: FetchPensOptions = {}): Promise<Pen[]> {
  return (await makeCodePenApi())
    .getPensByUserId(userId, options);
};

export type { Pen, FetchPensOptions, UserProfile } from './types';
