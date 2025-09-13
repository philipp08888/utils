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
const { request } = require("undici");

describe('safeRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Result.success when request is successful', async () => {
    const mockResponse = { statusCode: 200 };
    request.mockResolvedValueOnce(mockResponse);

    const result = await safeRequest('http://test.com');

    expect(Result.isSuccess(result)).toBe(true);
    if (result.isSuccess()) {
      expect(result.value).toBe(mockResponse);
    }
  });

  it('should return Result.failure with UndiciError when UndiciError is thrown', async () => {
    const error = new errors.UndiciError('Error');
    request.mockRejectedValueOnce(error);

    const result = await safeRequest('http://test.com');

    expect(Result.isFailure(result)).toBe(true);

    if (result.isFailure()) {
      expect(result.error).toBe(error);
    }
  });

  it('should return Result.failure with Error when a generic error is thrown', async () => {
    const error = new Error('Other error');
    request.mockRejectedValueOnce(error);

    const result = await safeRequest('http://test.com');

    expect(Result.isFailure(result)).toBe(true);

    if (result.isFailure()) {
      expect(result.error).toBe(error);
    }
  });
});