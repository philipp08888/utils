import { safeRequest } from './safeRequest';
import { Result } from '../monad';
import { errors } from 'undici';

jest.mock('undici', () => ({
  request: jest.fn(),
  errors: {
    UndiciError: class UndiciError extends Error {}
  }
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { request } = require('undici');

describe('safeRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Result.success when undici.request resolves', async () => {
    const mockResponse = { statusCode: 200 };
    request.mockResolvedValueOnce(mockResponse);

    const result = await safeRequest('http://test.com');

    expect(Result.isSuccess(result)).toBe(true);
    if (Result.isSuccess(result)) {
      expect(result.value).toBe(mockResponse);
    }
  });

  it('should return Result.failure with UndiciError when undici.request rejects with UndiciError', async () => {
    const error = new errors.UndiciError('Error');
    request.mockRejectedValueOnce(error);

    const result = await safeRequest('http://test.com');

    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error).toBe(error);
    }
  });

  it('should return Result.failure with Error when undici.request rejects with a generic Error', async () => {
    const error = new Error('Other error');
    request.mockRejectedValueOnce(error);

    const result = await safeRequest('http://test.com');

    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error).toBe(error);
    }
  });

  it('should return Result.failure with wrapped Error when undici.request rejects with a non-Error value', async () => {
    request.mockRejectedValueOnce('unexpected');

    const result = await safeRequest('http://test.com');

    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain('Unknown error');
    }
  });
});