import * as O from "fp-ts/Option";
import { useToken } from "./auth";
import { Configuration } from "@mause/financial-dash";
import { useMemo } from "react";

export default function useApi<T>(clazz: { new (c: Configuration): T }): T {
  const token = useToken();

  const api = useMemo(
    () =>
      new clazz(
        new Configuration({
          accessToken() {
            return O.fold<string, string>(
              () => {
                throw new Error("Don't have access token yet");
              },
              (token) => token,
            )(token);
          },
        }),
      ),
    [token, clazz],
  );

  return api;
}
