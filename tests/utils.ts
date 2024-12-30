import { vi } from 'vitest';
import { GetPenResponse, GetProfileResponse, GetPensResponse } from '../src/types';

/**
 * Mocks the API response with a pre-request for CSRF.
 */
export function mockApiResponse (responseData: GetPenResponse|GetProfileResponse|GetPensResponse) {
  const mockCsrfResponse = {
    text: vi.fn().mockResolvedValue('<meta name="csrf-token" content="mockToken">'),
    headers: {
      get: vi.fn().mockReturnValue('cp_session=mockCookie;')
    }
  };
  const mockApiResponse = {
    json: vi.fn().mockResolvedValue(responseData)
  };

  return vi.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(mockCsrfResponse as unknown as Response)
    .mockResolvedValueOnce(mockApiResponse as unknown as Response);
}
