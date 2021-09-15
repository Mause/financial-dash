import * as O from "fp-ts/Option";
import { constant } from "fp-ts/lib/function";
import { useToken } from "./auth";
import { Configuration } from "./financial-dash";

export default function useApi<T>(clazz: { new (c: Configuration): T }): T {
  const token = useToken();

  return new clazz(
    new Configuration({
      accessToken() {
        return O.getOrElse(constant(""))(token);
      },
    })
  );
}
