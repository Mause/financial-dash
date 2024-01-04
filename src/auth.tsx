import { fold, fromNullable, isSome, Option } from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";
import { useSupabase } from "react-supabase-fp";
import { SWRConfig } from "swr";
import React, { ReactNode, ReactPortal, useEffect, useState } from "react";

export function useToken(): Option<string> {
  const supabase = useSupabase();
  const [session, setSession] = useState<string>();

  useEffect(() => {
    if (isSome(supabase)) {
      supabase.value.auth.getSession().then(({ data }) => {
        setSession(data.session?.access_token);
      });
    }
  }, []);

  return fromNullable(session);
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
