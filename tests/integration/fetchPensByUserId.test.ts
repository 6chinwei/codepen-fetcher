import { describe, it, expect } from 'vitest';
import { fetchPensByUserId, Pen } from '../../dist/index';

describe('fetchPensByUserId', () => {

  it('should return pens of 6chinwei', { retry: 2 }, async () => {
    const userId = 'DEnXWE'; // ID of @6chinwei
    const options = { limit: 5 };

    const pens: Pen[] = await fetchPensByUserId(userId, options);

    expect(pens.length).toEqual(5);
  });
});
