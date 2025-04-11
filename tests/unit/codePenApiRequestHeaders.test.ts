import { describe, it, expect, beforeEach } from 'vitest';
import CodePenApiRequestHeaders from '../../src/codePenApiRequestHeaders';
import { mockFetchHtml } from './utils';

describe('CodePenApiRequestHeaders', () => {
  let headers: CodePenApiRequestHeaders;

  beforeEach(() => {
    headers = new CodePenApiRequestHeaders();
  });

  it('should set CSRF token and cookie headers', async () => {
    const token = 'mock-token';
    const cookie = 'mock-cookie';
    const mockResponseHtml = `<meta name="csrf-token" content="${token}">`;
    const mockResponseHeaders = `cp_session=${cookie}; Path=/; secure; HttpOnly; SameSite=None`;

    mockFetchHtml(mockResponseHtml, mockResponseHeaders);

    await headers.setupCsrfHeaders();

    expect(headers.get('X-Csrf-Token')).toBe(token);
    expect(headers.get('Cookie')).toBe(`cp_session=${cookie}`);
  });

  it('should throw an error if CSRF token is not found', async () => {
    const mockResponseHtml = '<html></html>';
    const cookie = 'mock-cookie';
    const mockResponseHeaders = `cp_session=${cookie}; Path=/; secure; HttpOnly; SameSite=None`;

    mockFetchHtml(mockResponseHtml, mockResponseHeaders);

    await expect(headers.setupCsrfHeaders()).rejects.toThrow('CSRF token not found');
  });

  it('should throw an error if CSRF cookie is not found', async () => {
    const token = 'mock-token';
    const mockResponseHtml = `<meta name="csrf-token" content="${token}">`;
    const mockResponseHeaders = '';

    mockFetchHtml(mockResponseHtml, mockResponseHeaders);

    await expect(headers.setupCsrfHeaders()).rejects.toThrow('CSRF cookie not found');
  });
});
