import { describe, it, expect } from 'vitest';
import { fetchProfile, UserProfile } from 'codepen-fetcher';

describe('fetchProfile', () => {

  it('should return profile of 6chinwei', { retry: 2 }, async () => {
    const username = '6chinwei';

    const profile: UserProfile = await fetchProfile(username);

    expect(profile.username).toEqual(username);
  });
});
