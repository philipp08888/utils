import { Result } from "../src";

/**
 * abstract readonly _tag: "SUCCESS" | "FAILURE";

  abstract isSuccess(): this is Success<E, V>;
  abstract isFailure(): this is Failure<E, V>;

  abstract getOrUndefined(): V | undefined; check
  abstract getOrNull(): V | null; check
  abstract getOrElse(fn: () => V): V; check

  abstract unwrap(): V; check
  abstract unwrapOr(defaultValue: V): V; check
  abstract unwrapErr(): E; check

  abstract map<U>(fn: (value: V) => U): Result<E, U>;
  abstract flatMap<U>(fn: (value: V) => Result<E, U>): Result<E, U>;
  abstract mapOnError<F>(fn: (error: E) => F): Result<F, V>;
 */

describe("Result Monad", () => {
  describe("Success", () => {
    const obj = {
      firstName: "Max",
      lastName: "Mustermann",
    };

    it("should create a successful result", () => {
      const result = Result.success(18);

      expect(result.isSuccess()).toBe(true);
      expect(result.isFailure()).toBe(false);
    });

    it("should unwrap correct object", () => {
      const result = Result.success<Error, typeof obj>(obj);

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBe(obj);
    });

    it("should throw when trying to unwrap error result", () => {
      const result = Result.success(obj);

      expect(() => result.unwrapErr()).toThrow(
        "Cannot unwrapErr on Success result"
      );
    });

    it("should return the value and not undefined", () => {
      const result = Result.success(18);

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrUndefined()).toBe(18);
    });

    it("should return the value and not null", () => {
      const result = Result.success(18);

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrNull()).toBe(18);
    });

    it("should return the value and not executing fn", () => {
      const result = Result.success(18);
      const fn = jest.fn(() => 8);

      expect(result.isSuccess()).toBe(true);
      expect(result.getOrElse(fn)).toBe(18);
      expect(fn).not.toHaveBeenCalled();
    });

    it("should unwrap the value and not default value", () => {
      const result = Result.success(18);

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrapOr(8)).toBe(18);
    });
  });

  describe("Failure", () => {
    it("should create a failure result", () => {
      const result = Result.failure(new Error("Failure"));

      expect(result.isFailure()).toBe(true);
      expect(result.isSuccess()).toBe(false);
    });

    it("should unwrap error", () => {
      const error = new Error("Error");
      const result = Result.failure(error);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapErr()).toBe(error);
    });

    it("should throw error when try to unwrap value on failure", () => {
      const result = Result.failure(new Error());

      expect(result.isFailure()).toBe(true);
      expect(() => result.unwrap()).toThrow(
        "Called unwrap on a Failure result:"
      );
    });

    it("should return undefined and not the value", () => {
      const result = Result.failure(new Error("Failure"));

      expect(result.isFailure()).toBe(true);
      expect(result.getOrUndefined()).toBe(undefined);
    });

    it("should return null and not the value", () => {
      const result = Result.failure(new Error("Failure"));

      expect(result.isFailure()).toBe(true);
      expect(result.getOrNull()).toBe(null);
    });

    it("should execute the fn and returning the value", () => {
      const result = Result.failure(new Error());
      const fn = jest.fn(() => 8);

      expect(result.isFailure()).toBe(true);
      expect(result.getOrElse(fn)).toBe(8);
      expect(fn).toHaveBeenCalled();
    });

    it("should unwrap the default value", () => {
      const result = Result.failure(new Error());

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapOr(8)).toBe(8);
    });
  });
});
