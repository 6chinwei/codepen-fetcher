import type { FetchPensOptions, GetPenResponse, GetPensResponse, GetProfileResponse, Pen, UserProfile } from '../../src/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CodePenGraphqlApi from '../../src/codePenGraphqlApi';
import ApiRequestHeaders from '../../src/codePenApiRequestHeaders';
import QueryBuilder from '../../src/codePenGraphqlQueryBuilder';
import { mockFetchJson } from './utils';

describe('CodePenGraphqlApi', () => {
  let api: CodePenGraphqlApi;
  let mockApiRequestHeaders: ApiRequestHeaders;
  let mockQueryBuilder: QueryBuilder;

  beforeEach(() => {
    vi.resetAllMocks();

    mockApiRequestHeaders = {
      setupCsrfHeaders: vi.fn().mockImplementation(() => {}),
    } as unknown as ApiRequestHeaders;

    mockQueryBuilder = {
      buildGetPenByIdQuery: vi.fn(),
      buildGetPensByUserIdQuery: vi.fn(),
      buildGetProfileByUsernameQuery: vi.fn(),
    } as unknown as QueryBuilder;

    api = new CodePenGraphqlApi(mockApiRequestHeaders, mockQueryBuilder);
  });

  it('should initialize the API', async () => {
    await api.init();

    expect(mockApiRequestHeaders.setupCsrfHeaders).toHaveBeenCalled();
  });

  it('should fetch a pen by ID', async () => {
    const pen: Pen = {
      id: 'abc123',
      title: 'Test Pen',
      owner: { id: '1', username: 'test user' },
      url: 'https://codepen.io/testpen',
      config: {
        css: '',
        cssPreProcessor: '',
        head: '',
        html: '',
        js: '',
        jsPreProcessor: ''
      }
    } as Pen;
    const mockPenResponse: GetPenResponse = { data: { pen } };

    mockFetchJson(mockPenResponse);

    const result = await api.getPenById(pen.id);

    expect(mockQueryBuilder.buildGetPenByIdQuery).toHaveBeenCalledWith(pen.id);
    expect(result).toEqual(pen);
  });

  it('should fetch a user profile by username', async () => {
    const profile: UserProfile = {
      id: '1',
      username: 'test user',
      name: 'Test User',
      avatar: 'https://example.com/avatar/large.png',
      bio: 'Test bio',
      location: 'Test location',
    } as UserProfile;
    const mockProfileResponse: GetProfileResponse = { data: { ownerByUsername: profile } };

    mockFetchJson(mockProfileResponse);

    const result = await api.getProfileByUsername(profile.username);

    expect(mockQueryBuilder.buildGetProfileByUsernameQuery).toHaveBeenCalledWith(profile.username);
    expect(result).toEqual(profile);
  });

  it('should fetch pens by user ID', async () => {
    const userId = 'abc123';
    const options: FetchPensOptions = { limit: 5 };
    const pens: Pen[] = [
      {
        id: 'pen1',
      } as Pen,
      {
        id: 'pen2',
      } as Pen,
    ];
    const mockPensResponse: GetPensResponse = { data: { pens: { pens } } };

    mockFetchJson(mockPensResponse);

    const result = await api.getPensByUserId(userId, options);

    expect(mockQueryBuilder.buildGetPensByUserIdQuery).toHaveBeenCalledWith(userId, options);
    expect(result).toEqual(pens);
  });
});
