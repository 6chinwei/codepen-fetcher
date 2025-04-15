import { describe, it, expect } from 'vitest';
import { fetchPen, Pen } from 'codepen-fetcher';

describe('fetchPen', () => {

  it('should fetch pen by ID: JoPRMeB', { retry: 2 }, async () => {
    const penId = 'JoPRMeB'; // ID of an example pen

    const pen: Pen = await fetchPen(penId);

    expect(pen.id).toEqual(penId);
  });
});
