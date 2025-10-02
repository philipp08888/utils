import {StatusCodes} from "http-status-codes";
import {RFC7807Problem} from "./RFC7807Problem";

export class NotFoundError extends RFC7807Problem {
    public readonly type = 'NOT_FOUND_ERROR' as const;
    public readonly status = StatusCodes.NOT_FOUND as const;
    public readonly title = "Not Found" as const;

    constructor(detail?: string, instance?: string) {
        super(detail, instance);
    }
}

export function isNotFoundError(error: unknown): error is NotFoundError {
    return error instanceof NotFoundError;
}