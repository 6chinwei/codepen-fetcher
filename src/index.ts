import type { Pen, FetchPensOptions, UserProfile } from './types';
import CodePenGraphqlApi from './codePenGraphqlApi';
import ApiRequestHeaders from './codePenApiRequestHeaders';
import QueryBuilder from './codePenGraphqlQueryBuilder';

let codePenApi: CodePenGraphqlApi | undefined;
let initPromise: Promise<CodePenGraphqlApi> | undefined;

async function makeCodePenApiInstance() {
  if (codePenApi) {
    return codePenApi;
  }

  if (!initPromise) {
    // Prevent duplicate initialization by using the same Promise
    initPromise = (async () => {
      const apiRequestHeaders = new ApiRequestHeaders();
      const queryBuilder = new QueryBuilder();

      codePenApi = await (new CodePenGraphqlApi(apiRequestHeaders, queryBuilder)).init();

      return codePenApi;
    })();
  }

  return initPromise;
}

/**
 * Fetch a pen by its ID, which can be found in the URL of the pen.
 *
 * @param penId
 */
export async function fetchPen(penId: string): Promise<Pen> {
  return (await makeCodePenApiInstance())
    .getPenById(penId);
}

/**
 * Fetch a user profile by username.
 *
 * @param username
 */
export async function fetchProfile(username: string): Promise<UserProfile> {
  return (await makeCodePenApiInstance())
    .getProfileByUsername(username);
}

/**
 * Fetch pens created by a specific user.
 *
 * @param userId
 * @param options
 */
export async function fetchPensByUserId(userId: string, options: FetchPensOptions = {}): Promise<Pen[]> {
  return (await makeCodePenApiInstance())
    .getPensByUserId(userId, options);
}

export type { Pen, FetchPensOptions, UserProfile } from './types';
