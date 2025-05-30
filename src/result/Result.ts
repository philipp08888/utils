abstract class ResultBase<E, V> {
  abstract readonly _tag: "SUCCESS" | "FAILURE";

  abstract isSuccess(): this is Success<E, V>;
  abstract isFailure(): this is Failure<E, V>;

  abstract getOrUndefined(): V | undefined;
  abstract getOrNull(): V | null;
  abstract getOrElse(fn: () => V): V;

  abstract unwrap(): V;
  abstract unwrapOr(defaultValue: V): V;
  abstract unwrapErr(): E;

  abstract map<U>(fn: (value: V) => U): Result<E, U>;
  abstract flatMap<U>(fn: (value: V) => Result<E, U>): Result<E, U>;
  abstract mapOnError<F>(fn: (error: E) => F): Result<F, V>;
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
