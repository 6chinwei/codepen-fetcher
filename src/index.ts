import CodePenGraphqlApi from './codePenGraphqlApi';
import { Pen, FetchPensOptions, UserProfile } from './types';

let api: CodePenGraphqlApi | null = null;

async function initializeApi() {
  if (!api) {
    api = new CodePenGraphqlApi();
    await api.init();
  }
}

/**
 * Fetch a pen by its ID, which can be found in the URL of the pen.
 *
 * @param penId
 */
export async function fetchPen(penId: string): Promise<Pen> {
  await initializeApi();

  return await api!.getPenById(penId);
};

/**
 * Fetch a user profile by username.
 *
 * @param username
 */
export async function fetchProfile(username: string): Promise<UserProfile> {
  await initializeApi();

  return await api!.getProfileByUsername(username);
}

/**
 * Fetch pens created by a specific user.
 *
 * @param userId
 * @param options Default: `{ limit: 10 }`
 */
export async function fetchPensByUserId(userId: string, options?: FetchPensOptions): Promise<Pen[]> {
  await initializeApi();

  return await api!.getPensByUserId(userId, options);
};

export { Pen, FetchPensOptions, UserProfile } from './types';
