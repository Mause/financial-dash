import * as O from "fp-ts/Option";
import { constant } from "fp-ts/lib/function";
import { useToken } from "./auth";
import { Configuration } from "./financial-dash";
import { BaseAPI } from "./financial-dash/base";

export default function useApi<T extends BaseAPI>(clazz: NewableFunction): T {
  const token = useToken();

  return clazz(
    new Configuration({
      accessToken() {
        return O.getOrElse(constant(""))(token);
      },
    })
  );
}
