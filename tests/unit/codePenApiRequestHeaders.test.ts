import { describe, it, expect, beforeEach } from 'vitest';
import CodePenApiRequestHeaders from '../../src/codePenApiRequestHeaders';

describe('CodePenApiRequestHeaders', () => {
  let headers: CodePenApiRequestHeaders;

  beforeEach(() => {
    headers = new CodePenApiRequestHeaders();
  });

  it('should setup default headers', async () => {
    await headers.setup();

    expect(headers.has('Accept')).toBe(true);
    expect(headers.has('Content-Type')).toBe(true);
    expect(headers.has('X-Requested-With')).toBe(true);
  });

  it('should setup anonymous user CSRF headers', async () => {
    await headers.setup();

    expect(headers.has('X-Csrf-Token')).toBe(true);
    expect(headers.has('Cookie')).toBe(true);
  });
});
