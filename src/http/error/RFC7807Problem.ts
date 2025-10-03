import { StatusCodes } from "http-status-codes";

/**
 * This type represents all possible error cases which are currently modeled by this library.
 *
 * I decided to use these simplified types over the recommended URI format, because I think this way it is easier for the client
 * to determine which kind of error case it is.
 */
export type ProblemType =
  | "BAD_REQUEST_ERROR"
  | "NOT_FOUND_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "UNPROCESSABLE_ENTITY_ERROR";

/**
 * RFC 7807 Problem Details for HTTP APIs implementation.
 * @see https://www.rfc-editor.org/rfc/rfc7807
 */
export abstract class RFC7807Problem extends Error {
  abstract readonly type: ProblemType;
  abstract readonly status: StatusCodes;
  abstract readonly title: string;
  readonly detail?: string;
  readonly instance?: string;

  protected constructor(detail?: string, instance?: string) {
    super(detail ?? "Unknown error");

    this.name = this.constructor.name;
    this.instance = instance;
    this.detail = detail;

    Object.defineProperty(this, "message", {
      get: () => this.detail ?? this.title,
      configurable: false,
      enumerable: true,
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * JSON.stringify() uses the toJSON fn of an object (if existing) to build the JSON string.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description
   */
  public toJSON(): Record<string, unknown> {
    const serializedProperties: Record<string, unknown> = {};

    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = this[key];

        // These are internal properties we don't want to serialize/expose
        if (key === "message" || key === "name" || key === "stack") {
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

export function isRFC7807Problem(error: unknown): error is RFC7807Problem {
  return error instanceof RFC7807Problem;
}
