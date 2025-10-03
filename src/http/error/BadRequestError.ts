import { StatusCodes } from "http-status-codes";
import { RFC7807Problem } from "./RFC7807Problem";

export class BadRequestError extends RFC7807Problem {
  public readonly type = "BAD_REQUEST_ERROR" as const;
  public readonly status = StatusCodes.BAD_REQUEST as const;
  public readonly title = "Bad Request" as const;

  constructor(detail?: string, instance?: string) {
    super(detail, instance);
  }
}

export function isBadRequestError(error: unknown): error is BadRequestError {
  return error instanceof BadRequestError;
}
