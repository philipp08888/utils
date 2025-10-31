type MatcherOptions<E, V, R> = {
  onSuccess: (value: V) => R;
  onFailure: (error: E) => R;
};

abstract class ResultBase<E, V> {
  /**
   * Discriminator property to distinguish between success and failure states.
   */
  abstract readonly _tag: "SUCCESS" | "FAILURE";

  /**
   * Type guard to check if this result represents a successful operation.
   */
  abstract isSuccess(): this is Success<E, V>;

  /**
   * Type guard to check if this result represents a failed operation.
   */
  abstract isFailure(): this is Failure<E, V>;

  /**
   * Safely extracts the value from a successful result, returning undefined for failures.
   */
  abstract getOrUndefined(): V | undefined;

  /**
   * Safely extracts the value from a successful result, returning null for failures.
   */
  abstract getOrNull(): V | null;

  /**
   * Safely extracts the value from a successful result, or computes a default value for failures.
   * @param fn - Function that provides the default value
   */
  abstract getOrElse(fn: () => V): V;

  /**
   * Extracts the value from a successful result, throwing an error for failures.
   * Use with caution - prefer safer alternatives like getOrElse() when possible.
   */
  abstract unwrap(): V;

  /**
   * Extracts the value from a successful result, or returns a default value for failures.
   * @param defaultValue
   * @returns {V}
   */
  abstract unwrapOr(defaultValue: V): V;

  /**
   * Extracts the error from a failed result, throwing an error for successes.
   * Use with caution - ensure you've checked isFailure() first.
   *
   * @returns {E} The wrapped error
   */
  abstract unwrapErr(): E;

  abstract map<U>(fn: (value: V) => U): Result<E, U>;

  abstract flatMap<U>(fn: (value: V) => Result<E, U>): Result<E, U>;

  abstract mapOnError<F>(fn: (error: E) => F): Result<F, V>;

  /**
   * Transforms the Result into a value of type R by applying one of two functions
   * based on whether the Result is success or failure.
   *
   * @typeParam R - The return type of both matcher functions.
   * @param options Matcher for each case (success, failure)
   * @returns The result of applying the appropriate matcher function
   */
  abstract match<R>(options: MatcherOptions<E, V, R>): R;
}

class Success<E, V> extends ResultBase<E, V> {
  readonly _tag = "SUCCESS" as const;

  constructor(public readonly value: V) {
    super();
  }

  isSuccess(): this is Success<E, V> {
    return true;
  }

  isFailure(): this is Failure<E, V> {
    return false;
  }

  getOrUndefined(): V {
    return this.value;
  }

  getOrNull(): V {
    return this.value;
  }

  getOrElse(_fn: () => V): V {
    return this.value;
  }

  unwrap(): V {
    return this.value;
  }

  unwrapOr(_defaultValue: V): V {
    return this.value;
  }

  unwrapErr(): E {
    throw new Error("Cannot unwrapErr on Success result");
  }

  map<U>(fn: (value: V) => U): Result<E, U> {
    return new Success<E, U>(fn(this.value));
  }

  flatMap<U>(fn: (value: V) => Result<E, U>): Result<E, U> {
    return fn(this.value);
  }

  mapOnError<F>(_fn: (error: E) => F): Result<F, V> {
    return new Success<F, V>(this.value);
  }

  match<R>(options: MatcherOptions<E, V, R>): R {
    return options.onSuccess(this.value);
  }
}

class Failure<E, V> extends ResultBase<E, V> {
  readonly _tag = "FAILURE" as const;

  constructor(public readonly error: E) {
    super();
  }

  isSuccess(): this is Success<E, V> {
    return false;
  }

  isFailure(): this is Failure<E, V> {
    return true;
  }

  getOrUndefined(): undefined {
    return undefined;
  }

  getOrNull(): null {
    return null;
  }

  getOrElse(fn: () => V): V {
    return fn();
  }

  unwrap(): V {
    throw new Error(`Called unwrap on a Failure result: '${this.error}'`);
  }

  unwrapOr(defaultValue: V): V {
    return defaultValue;
  }

  unwrapErr(): E {
    return this.error;
  }

  map<U>(_fn: (value: V) => U): Result<E, U> {
    return new Failure<E, U>(this.error);
  }

  flatMap<U>(_fn: (value: V) => Result<E, U>): Result<E, U> {
    return new Failure<E, U>(this.error);
  }

  mapOnError<F>(fn: (error: E) => F): Result<F, V> {
    return new Failure<F, V>(fn(this.error));
  }

  match<R>(options: MatcherOptions<E, V, R>): R {
    return options.onFailure(this.error);
  }
}

export type Result<E, V> = Success<E, V> | Failure<E, V>;

function isSuccess<E, V>(result: Result<E, V>): result is Success<E, V> {
  return result._tag === "SUCCESS";
}

function isFailure<E, V>(result: Result<E, V>): result is Failure<E, V> {
  return result._tag === "FAILURE";
}

function success<E, V>(value: V): Success<E, V> {
  return new Success<E, V>(value);
}

function failure<E, V>(error: E): Failure<E, V> {
  return new Failure<E, V>(error);
}

export const Result = { isSuccess, isFailure, success, failure };
