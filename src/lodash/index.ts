import _ from "lodash";
import { isDefined } from "./isDefined";

_.mixin({ isDefined });

declare module "lodash" {
  interface LoDashStatic {
    isDefined<T>(value: T | undefined): value is T;
  }
}

export default _;
