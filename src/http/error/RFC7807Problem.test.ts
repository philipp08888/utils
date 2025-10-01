import {RFC7807Problem} from "./RFC7807Problem";
import {StatusCodes} from "http-status-codes";

describe("RFC7807Problem", () => {
    it("should serialize to JSON correctly", () => {
        const exampleError = new RFC7807Problem({
            status: StatusCodes.FORBIDDEN,
            title: "Forbidden",
            detail: "You do not have permission to access this resource.",
            message: "User tried to access resource without permission"
        });

        expect(exampleError).toBeInstanceOf(RFC7807Problem);
        expect(exampleError).toBeInstanceOf(Error);

        const serializedError = JSON.stringify(exampleError);
        const deserializedError = JSON.parse(serializedError);

        // Ensure message property is not present
        expect(deserializedError).toStrictEqual({
            status: 403,
            title: "Forbidden",
            detail: "You do not have permission to access this resource.",
            type: "about:blank"
        })
    });

    it("should serialize subclass properties", () => {
        // An example implementation of an error based on the RFC 7807 problem
        class CustomError extends RFC7807Problem {
            public readonly customProperty: string | undefined;

            constructor(customProperty?: string) {
                super({title: "Custom Error", type: "CUSTOM_ERROR"});

                this.customProperty = customProperty;
            }
        }

        const myCustomError = new CustomError("This information is useful");
        const serializedError = JSON.stringify(myCustomError);
        const deserializedError = JSON.parse(serializedError);

        expect("customProperty" in deserializedError).toBe(true);
        expect(deserializedError).toStrictEqual({
            title: "Custom Error",
            type: "CUSTOM_ERROR",
            customProperty: "This information is useful"
        });
    });

    it("should follow: message > detail > title > type for Error.message", () => {
        const e1 = new RFC7807Problem({ type: "X" });
        expect(e1.message).toBe("X");

        const e2 = new RFC7807Problem({ title: "T", type: "X" });
        expect(e2.message).toBe("T");

        const e3 = new RFC7807Problem({ detail: "D", title: "T", type: "X" });
        expect(e3.message).toBe("D");

        const e4 = new RFC7807Problem({ message: "M", detail: "D", title: "T", type: "X" });
        expect(e4.message).toBe("M");
    });
});

