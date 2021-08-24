import { fold, fromNullable, some, Option, chain } from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";
import { useSupabase } from "react-supabase-fp";
import { SWRConfig } from "swr";
import React from "react";

export function useToken(): Option<string> {
  const supabase = useSupabase();

  return pipe(
    supabase,
    chain((thing) => fromNullable(thing.auth.session())),
    chain((session) => some(session.access_token))
  );
}
function useFetcher() {
  const token = useToken();
  return (url: string) =>
    fetch(url, {
      headers: pipe(
        token,
        fold(constant({}), (Authorization) => ({ Authorization }))
      ),
    }).then((res) => res.json());
}

export const AuthProvider: React.VFC<{ children: any }> = (props) => {
  const fetcher = useFetcher();

  return <SWRConfig value={{ fetcher }}>{props.children}</SWRConfig>;
};
