import {RFC7807Problem} from "./RFC7807Problem";
import {StatusCodes} from "http-status-codes";

export class UnprocessableEntityError extends RFC7807Problem {
    public readonly type = 'UNPROCESSABLE_ENTITY_ERROR' as const;
    public readonly status = StatusCodes.UNPROCESSABLE_ENTITY as const;
    public readonly title = "Unprocessable Entity" as const;

    constructor(detail?: string, instance?: string) {
        super(detail, instance);
    }
}

export function isUnprocessableEntityError(error: unknown): error is UnprocessableEntityError {
    return error instanceof UnprocessableEntityError;
}