import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockApiResponse } from './utils';
import { fetchPensByUserId, Pen, FetchPensOptions } from '../../src/index';
import { GetPensResponse } from '../../src/types';

describe('fetchPensByUserId', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return pens with correct properties', async () => {
    const mockUserId = 'abc123';
    const mockOptions: FetchPensOptions = { limit: 5 };
    const mockPens: Pen[] = [
      {
        id: 'pen1',
      } as Pen,
      {
        id: 'pen2',
      } as Pen,
    ];
    const mockPensResponse: GetPensResponse = { data: { pens: { pens: mockPens } } };

    mockApiResponse(mockPensResponse);

    const pens = await fetchPensByUserId(mockUserId, mockOptions);

    expect(pens.length).toEqual(2);
    expect(pens[0].id).toEqual('pen1');
  });
});
