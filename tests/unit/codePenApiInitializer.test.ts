import { describe, it, expect, expectTypeOf, vi, beforeEach } from 'vitest';
import type { CodePenApi } from '../../src/types';

const mockApi: CodePenApi = {
  getPenById: vi.fn(),
  getProfileByUsername: vi.fn(),
  getPensByUserId: vi.fn(),
};

const mockInit = vi.fn().mockResolvedValue(mockApi);

vi.mock('../../src/codePenGraphqlApi', () => ({
  default: vi.fn().mockImplementation(() => ({
    init: mockInit
  })),
}));
vi.mock('../../src/codePenApiRequestHeaders', () => ({
  default: vi.fn(),
}));
vi.mock('../../src/codePenGraphqlQueryBuilder', () => ({
  default: vi.fn(),
}));

describe('codePenApiInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should initialize CodePenGraphqlApi only once and return the same instance', async () => {
    const { makeCodePenApiInstance } = await import('../../src/codePenApiInitializer');
    const instance1 = await makeCodePenApiInstance();
    const instance2 = await makeCodePenApiInstance();

    expect(instance1).toBe(instance2);
    expectTypeOf(instance1).toEqualTypeOf<CodePenApi>();
    expect(mockInit).toHaveBeenCalledTimes(1);
  });

  it('should return the same promise when called concurrently', async () => {
    const { makeCodePenApiInstance } = await import('../../src/codePenApiInitializer');
    const promise1 = makeCodePenApiInstance();
    const promise2 = makeCodePenApiInstance();

    expect(promise1).toStrictEqual(promise2);
    expectTypeOf(promise1).toEqualTypeOf<Promise<CodePenApi>>();

    const [instance1, instance2] = await Promise.all([promise1, promise2]);

    expect(instance1).toBe(instance2);
    expect(mockInit).toHaveBeenCalledTimes(1);
  });
});
