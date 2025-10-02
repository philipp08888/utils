import {StatusCodes} from "http-status-codes";
import {BadRequestError} from "./BadRequestError";
import {RFC7807Problem, isRFC7807Problem} from "./RFC7807Problem";

// Test subclass with additional fields
class CustomError extends RFC7807Problem {
    public readonly type = 'BAD_REQUEST_ERROR' as const;
    public readonly status = StatusCodes.BAD_REQUEST as const;
    public readonly title = "Custom Error" as const;
    public readonly customField: string;
    public readonly customNumber: number;

    constructor(customField: string, customNumber: number, detail?: string, instance?: string) {
        super(detail, instance);
        this.customField = customField;
        this.customNumber = customNumber;
    }
}

describe("RFC7807Problem", () => {
    describe("toJSON filtering mechanism", () => {
        it("should exclude 'message', 'name' and 'stack' from JSON serialization", () => {
            const error = new BadRequestError("Test detail");
            const json = JSON.parse(JSON.stringify(error));

            expect(json.message).toBeUndefined();
            expect(json.name).toBeUndefined();
            expect(json.stack).toBeUndefined();
        });

        it("should include RFC 7807 standard fields", () => {
            const error = new BadRequestError("Invalid input", "/api/users/123");
            const json = JSON.parse(JSON.stringify(error));

            expect(json.type).toBe('BAD_REQUEST_ERROR');
            expect(json.status).toBe(StatusCodes.BAD_REQUEST);
            expect(json.title).toBe("Bad Request");
            expect(json.detail).toBe("Invalid input");
            expect(json.instance).toBe("/api/users/123");
        });

        it("should exclude undefined optional fields", () => {
            const error = new CustomError("Test", 1);
            const json = JSON.parse(JSON.stringify(error));

            expect(json.detail).toBeUndefined();
            expect(json.instance).toBeUndefined();
        });
    });

    it("should include both RFC 7807 fields and custom fields", () => {
        const error = new CustomError("test", 123, "Error detail", "/api/test");
        const json = JSON.parse(JSON.stringify(error));

        // RFC 7807 fields
        expect(json.type).toBe('BAD_REQUEST_ERROR');
        expect(json.status).toBe(StatusCodes.BAD_REQUEST);
        expect(json.title).toBe("Custom Error");
        expect(json.detail).toBe("Error detail");
        expect(json.instance).toBe("/api/test");

        // Custom fields
        expect(json.customField).toBe("test");
        expect(json.customNumber).toBe(123);
    });

    describe("instanceof checks with subclasses", () => {
        it("should recognize custom error as instance of RFC7807Problem", () => {
            const error = new CustomError("test", 1);

            expect(error instanceof RFC7807Problem).toBe(true);
            expect(isRFC7807Problem(error)).toBe(true);
        });

        it("should recognize custom error as instance of Error", () => {
            const error = new CustomError("Test", 1);

            expect(error instanceof Error).toBe(true);
        });

        it("should not recognize non-RFC7807Problem as RFC7807Problem", () => {
            const regularError = new Error("Regular error");

            expect(regularError instanceof RFC7807Problem).toBe(false);
            expect(isRFC7807Problem(regularError)).toBe(false);
        });
    });

    describe("message getter", () => {
        it("should return detail when detail is provided", () => {
            const error = new CustomError("Test", 1, "Detailed error message");

            expect(error.message).toBe("Detailed error message");
        });

        it("should return title when detail is not provided", () => {
            const error = new CustomError("Test", 1);
            expect(error.message).toBe("Custom Error");
        });
    });

    it("should set name to constructor name for custom error", () => {
        const error = new CustomError("Test", 1);

        expect(error.name).toBe("CustomError");
    });
});