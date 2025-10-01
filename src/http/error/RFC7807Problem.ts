import {StatusCodes} from "http-status-codes";

export interface RFC7807Options {
    /**
     * @default "about:blank"
     */
    type?: string;
    title?: string;
    status?: StatusCodes;
    detail?: string;
    instance?: string;
    // Explicit override for Error.message
    message?: string;
}

/**
 * Represents an <b>RFC 7807 Problem</b> Details error.
 * @see https://datatracker.ietf.org/doc/html/rfc7807
 */
export class RFC7807Problem extends Error {
    public readonly type: string | undefined;
    public readonly title: string | undefined;
    public readonly status: StatusCodes | undefined;
    public readonly detail: string | undefined;
    public readonly instance: string | undefined;

    public constructor({title, instance, type = "about:blank", status, detail, message}: RFC7807Options) {
        const errorMessage = message ?? detail ?? title ?? type;
        super(errorMessage);

        this.name = "RFC7807Problem";
        this.title = title;
        this.instance = instance;
        this.type = type;
        this.status = status;
        this.detail = detail;

        Object.setPrototypeOf(this, RFC7807Problem.prototype);

        // Better stack traces in V8
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    public toJSON(): Record<string, unknown> {
        const serializedProperties: Record<string, unknown> = {};

        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                const value = this[key];

                // These are internal properties we don't want to serialize/expose
                if (key === 'message' || key === 'name' || key === 'stack') {
                    continue;
                }

                if (value !== undefined) {
                    serializedProperties[key] = value;
                }
            }
        }

        return serializedProperties;
    }
}

export function isRFC7807Problem(value: unknown): value is RFC7807Problem {
    return value instanceof RFC7807Problem;
}