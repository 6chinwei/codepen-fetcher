import type { FetchPensOptions, Pen, UserProfile } from '../../src/types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCodePenGraphqlApi = {
  init: vi.fn(),
  getPenById: vi.fn(),
  getProfileByUsername: vi.fn(),
  getPensByUserId: vi.fn()
};

vi.mock('../../src/codePenGraphqlApi', () => {
  return {
    default: vi.fn().mockImplementation(() => mockCodePenGraphqlApi),
  };
});
vi.mock('../../src/codePenApiRequestHeaders', () => ({ default: vi.fn()}));
vi.mock('../../src/codePenGraphqlQueryBuilder', () => ({ default: vi.fn()}));

describe('CodePen Fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('fetchPen() should fetch a pen by its ID', async () => {
    const penId = '12345';
    const pen = { id: penId, title: 'Test Pen' } as Pen;

    mockCodePenGraphqlApi.getPenById.mockResolvedValue(pen);

    const { fetchPen } = await import('../../src/');
    const result = await fetchPen(penId);

    expect(mockCodePenGraphqlApi.init).toHaveBeenCalled();
    expect(mockCodePenGraphqlApi.getPenById).toHaveBeenCalledWith(penId);
    expect(result).toEqual(pen);
  });

  it('fetchProfile() should fetch a user profile by username', async () => {
    const username = 'testuser';
    const profile = { username, name: 'Test User' } as UserProfile;

    mockCodePenGraphqlApi.getProfileByUsername.mockResolvedValue(profile);

    const { fetchProfile } = await import('../../src/');
    const result = await fetchProfile(username);

    expect(mockCodePenGraphqlApi.init).toHaveBeenCalled();
    expect(mockCodePenGraphqlApi.getProfileByUsername).toHaveBeenCalledWith(username);
    expect(result).toEqual(profile);
  });

  it('fetchPensByUserId() should fetch pens by a user id', async () => {
    const userId = 'user123';
    const options = { limit: 10, a: 1 } as FetchPensOptions;
    const pens = [
      { id: 'pen1', title: 'Pen 1' },
      { id: 'pen2', title: 'Pen 2' },
    ] as Pen[];

    mockCodePenGraphqlApi.getPensByUserId.mockResolvedValue(pens);

    const { fetchPensByUserId } = await import('../../src/');
    const result = await fetchPensByUserId(userId, options);

    expect(mockCodePenGraphqlApi.init).toHaveBeenCalled();
    expect(mockCodePenGraphqlApi.getPensByUserId).toHaveBeenCalledWith(userId, options);
    expect(result).toEqual(pens);
  });

  it('init() should only be called once', async () => {
    const penId = '12345';
    const pen = { id: penId, title: 'Test Pen' } as Pen;

    mockCodePenGraphqlApi.getPenById.mockResolvedValue(pen);

    const { fetchPen } = await import('../../src/');

    await fetchPen(penId);
    await fetchPen(penId);
    await fetchPen(penId);

    expect(mockCodePenGraphqlApi.init).toHaveBeenCalledTimes(1);
    expect(mockCodePenGraphqlApi.getPenById).toHaveBeenCalledTimes(3);
  });
});
