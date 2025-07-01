import type { Pen, FetchPensOptions, UserProfile } from './types';
import { makeCodePenApiInstance } from './codePenApiInitializer';

/**
 * Fetch a pen by its ID
 *
 * @param penId The ID of the pen. It can be found in the URL of the pen. For example, the `penId` of https://codepen.io/6chinwei/pen/gbYRQmN is `gbYRQmN`.
 * @return A Promise that resolves to a `Pen` object or `null` if the pen does not exist.
 * @example Fetch a pen by ID
 * ```ts
 * import { fetchPen } from 'codepen-fetcher';
 * const pen = await fetchPen('gbYRQmN'); // a `Pen` object
 * ```
 * @example Fetch a not-existing pen
 * ```ts
 * import { fetchPen } from 'codepen-fetcher';
 * const pen = await fetchPen('notExistPenId'); // null
 * ```
 */
export async function fetchPen(penId: string): Promise<Pen|null> {
  return (await makeCodePenApiInstance())
    .getPenById(penId);
}

/**
 * Fetch a CodePen user's profile (e.g., ID and Name) by their username.
 *
 * @param username The username of a CodePen user.
 * @return A Promise that resolves to a `UserProfile` object or `null` if the user does not exist.
 * @example Fetch a user profile by username
 * ```ts
 * import { fetchProfile } from 'codepen-fetcher';
 * const profile = await fetchProfile('6chinwei'); // a `UserProfile` object
 * ```
 * @example Fetch a not-existing user profile
 * ```ts
 * import { fetchProfile } from 'codepen-fetcher';
 * const profile = await fetchProfile('notExistUsername'); // null
 * ```
 */
export async function fetchProfile(username: string): Promise<UserProfile|null> {
  return (await makeCodePenApiInstance())
    .getProfileByUsername(username);
}

/**
 * Fetch pens owned by a specific user (using their user ID, not username).
 *
 * @param userId The ID of the user.
 * @param options Optional settings for fetching.
 * @param options.cursor A cursor string for pagination. Defaults is `undefined`.
 * @param options.limit Maximum number of pens to return. Defaults is `10`.
 * @param options.sortBy Field to sort by: `'Id'`, `'Popularity'`, or `'UpdatedAt'`. Defaults is `undefined`.
 * @param options.sortOrder Sort direction: `'Asc'` or `'Desc'`. Defaults is `undefined`.
 * @returns A Promise that resolves to an array of `Pen` objects.
 * @example Fetch pens by user ID
 * ```ts
 * import { fetchPensByUserId } from 'codepen-fetcher';
 * const userId = 'DEnXWE'; // ID of the user: `6chinwei`
 * const options = { limit: 5 };
 * const pens = await fetchPensByUserId(userId, options); // an array of `Pen` objects
 * ```
 */
export async function fetchPensByUserId(userId: string, options?: FetchPensOptions): Promise<Pen[]> {
  return (await makeCodePenApiInstance())
    .getPensByUserId(userId, options);
}

export type { Pen, FetchPensOptions, UserProfile } from './types';
