import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CodePenApi } from '../../src/types';

// Allow MockCodePenApi to inherit all structure of CodePenApi
type MockCodePenApi = {
  [K in keyof CodePenApi]: ReturnType<typeof vi.fn> & CodePenApi[K];
};

const mockCodePenApi: MockCodePenApi = {
  getPenById: vi.fn(),
  getProfileByUsername: vi.fn(),
  getPensByUserId: vi.fn(),
};

vi.mock('../../src/codePenApiInitializer', () => ({
  makeCodePenApiInstance: vi.fn(() => Promise.resolve(mockCodePenApi)),
}));

describe('CodePen Fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('fetchPen() should fetch a pen by its ID', async () => {
    const penId = '12345';
    const pen = { id: penId, title: 'Test Pen' };

    mockCodePenApi.getPenById.mockResolvedValue(pen);

    const { fetchPen } = await import('../../src/');

    const result = await fetchPen(penId);

    expect(mockCodePenApi.getPenById).toHaveBeenCalledWith(penId);
    expect(result).toEqual(pen);
  });

  it('fetchProfile() should fetch a user profile by username', async () => {
    const username = 'testuser';
    const profile = { username, name: 'Test User' };

    mockCodePenApi.getProfileByUsername.mockResolvedValue(profile);

    const { fetchProfile } = await import('../../src/');

    const result = await fetchProfile(username);

    expect(mockCodePenApi.getProfileByUsername).toHaveBeenCalledWith(username);
    expect(result).toEqual(profile);
  });

  it('fetchPensByUserId() should fetch pens by a user id', async () => {
    const userId = 'user123';
    const pens = [
      { id: 'pen1', title: 'Pen 1' },
      { id: 'pen2', title: 'Pen 2' },
    ];

    mockCodePenApi.getPensByUserId.mockResolvedValue(pens);

    const { fetchPensByUserId } = await import('../../src/');

    const result = await fetchPensByUserId(userId);

    expect(mockCodePenApi.getPensByUserId).toHaveBeenCalledWith(userId, undefined);
    expect(result).toEqual(pens);
  });
});
