import { RFC7807Problem } from "./RFC7807Problem";
import { StatusCodes } from "http-status-codes";

export class InternalServerError extends RFC7807Problem {
  public readonly type = "INTERNAL_SERVER_ERROR" as const;
  public readonly status = StatusCodes.INTERNAL_SERVER_ERROR as const;
  public readonly title = "Internal Server Error" as const;

  constructor(detail?: string, instance?: string) {
    super(detail, instance);
  }
}

export function isInternalServerError(
  error: unknown,
): error is InternalServerError {
  return error instanceof InternalServerError;
}
