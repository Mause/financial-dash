import * as O from "fp-ts/Option";
import { constant } from "fp-ts/lib/function";
import { useToken } from "./auth";
import { Configuration } from "./financial-dash";
import { useEffect, useState } from "react";

export default function useApi<T>(clazz: (c: Configuration) => T): T {
  const token = useToken();
  const [api, setApi] = useState(
    clazz(
      new Configuration({
        accessToken() {
          throw new Error("Don't have access token yet");
        },
      })
    )
  );

  useEffect(() => {
    setApi(
      clazz(
        new Configuration({
          accessToken() {
            return O.getOrElse(constant(""))(token);
          },
        })
      )
    );
  }, [token]);

  return api;
}
