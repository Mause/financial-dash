import { fold, fromNullable, some, Option, chain } from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";
import { useSupabase } from "react-supabase-fp";
import { SWRConfig } from "swr";
import React, { ReactNode, ReactPortal } from "react";

export function useToken(): Option<string> {
  const supabase = useSupabase();

  return pipe(
    supabase,
    chain((thing) => fromNullable(thing.auth.session())),
    chain((session) => some(session.access_token)),
  );
}
function useFetcher() {
  const token = useToken();
  return (url: string) =>
    fetch(url, {
      headers: pipe(
        token,
        fold(constant({}), (token) => ({ Authorization: "Bearer " + token })),
      ),
    }).then((res) => res.json());
}

export function AuthProvider(props: {
  children: ReactNode | ReactPortal;
}): JSX.Element {
  const fetcher = useFetcher();

  return <SWRConfig value={{ fetcher }}>{props.children}</SWRConfig>;
}
