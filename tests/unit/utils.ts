import { vi } from 'vitest';

export function mockFetchJson (responseData: unknown) {
  const mockResponse = {
    ok: true,
    json: vi.fn().mockResolvedValue(responseData)
  };

  return vi.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(mockResponse as unknown as Response);
}

export function mockFetchError (status: number, statusText?: string) {
  const mockResponse = {
    ok: false,
    status: status,
    statusText: statusText || '',
  };

  return vi.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(mockResponse as unknown as Response);
}

export function mockFetchHtml (responseHtml: string, responseHeaders: string = '') {
  const mockResponse = {
    text: vi.fn().mockResolvedValue(responseHtml),
    headers: {
      get: vi.fn().mockReturnValue(responseHeaders)
    }
  };

  return vi.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(mockResponse as unknown as Response);
}
