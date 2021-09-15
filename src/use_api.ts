import { useState, ChangeEvent, FormEvent } from "react";
import * as O from "fp-ts/Option";
import { constant } from "fp-ts/lib/function";
import { useToken } from "../auth";
import { InvoiceApi, Configuration } from "../financial-dash";

export default function useApi<T>(clazz: (c: Configuration) -> T): T {
  const token = useToken();

  return clazz(
    new Configuration({
      accessToken() {
        return O.getOrElse(constant(""))(token);
      },
    })
  );
}
