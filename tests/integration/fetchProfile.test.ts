import { describe, it, expect } from 'vitest';
import { fetchProfile, UserProfile } from '../../dist/index';

describe('fetchProfile', () => {

  it('should return profile of 6chinwei', async () => {
    const username = '6chinwei';

    const profile: UserProfile = await fetchProfile(username);

    expect(profile.username).toEqual(username);
  });
});
