import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockApiResponse } from './utils';
import { fetchProfile, UserProfile } from '../src/index';
import { GetProfileResponse } from '../src/types';

describe('fetchProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return profile with correct properties', async () => {
    const mockProfile: UserProfile = {
      id: '1',
      username: 'test user',
      name: 'Test User',
      avatar: 'https://example.com/avatar/large.png',
      bio: 'Test bio',
      location: 'Test location',
    } as UserProfile;
    const mockProfileResponse: GetProfileResponse = { data: { ownerByUsername: mockProfile } };

    mockApiResponse(mockProfileResponse);

    const profile = await fetchProfile(mockProfile.username);

    expect(profile).toEqual(mockProfile);
  });
});
