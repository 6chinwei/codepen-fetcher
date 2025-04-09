import type { Pen, FetchPensOptions, UserProfile } from './types';
import CodePenGraphqlApi from './codePenGraphqlApi';

const api = new CodePenGraphqlApi();

/**
 * Fetch a pen by its ID, which can be found in the URL of the pen.
 *
 * @param penId
 */
export async function fetchPen(penId: string): Promise<Pen> {
  return (await api.init())
    .getPenById(penId);
};

/**
 * Fetch a user profile by username.
 *
 * @param username
 */
export async function fetchProfile(username: string): Promise<UserProfile> {
  return (await api.init())
    .getProfileByUsername(username);
}

/**
 * Fetch pens created by a specific user.
 *
 * @param userId
 * @param options
 */
export async function fetchPensByUserId(userId: string, options: FetchPensOptions = {}): Promise<Pen[]> {
  return (await api.init())
    .getPensByUserId(userId, options);
};

export type { Pen, FetchPensOptions, UserProfile } from './types';
