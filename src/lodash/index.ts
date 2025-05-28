import _ from "lodash";

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

_.mixin({ isDefined });

declare module "lodash" {
  interface LoDashStatic {
    isDefined<T>(value: T | undefined): value is T;
  }
}

export default _;
