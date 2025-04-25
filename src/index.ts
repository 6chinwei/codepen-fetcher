import type { Pen, FetchPensOptions, UserProfile } from './types';
import { makeCodePenApiInstance } from './codePenApiInitializer';

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
export async function fetchPensByUserId(userId: string, options?: FetchPensOptions): Promise<Pen[]> {
  return (await makeCodePenApiInstance())
    .getPensByUserId(userId, options);
}

export type { Pen, FetchPensOptions, UserProfile } from './types';
