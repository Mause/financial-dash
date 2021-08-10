import { fold, fromNullable, none, some, Option, chain } from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";
import { useSupabase } from "react-supabase-fp";

export function useToken(): Option<string> {
  const supabase = useSupabase();

  return pipe(
    supabase,
    chain((thing) => fromNullable(thing.auth.session())),
    chain((session) => some(session.access_token))
  );
}
export function useFetcher() {
  const token = useToken();
  return (url: string) =>
    fetch(url, {
      headers: pipe(
        token,
        fold(constant({}), (Authorization) => ({ Authorization }))
      ),
    });
}
