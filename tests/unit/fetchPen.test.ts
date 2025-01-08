import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockApiResponse } from './utils';
import { fetchPen, Pen } from '../../src/index';
import { GetPenResponse } from '../../src/types';

describe('fetchPen', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch pen by ID', async () => {
    const mockPen: Pen = {
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
    const mockPenResponse: GetPenResponse = { data: { pen: mockPen } };

    mockApiResponse(mockPenResponse);

    const pen = await fetchPen(mockPen.id);

    expect(pen).toEqual(mockPen);
  });
});
