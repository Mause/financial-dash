import useSWR, { Key } from "swr";
import * as RD from "@devexperts/remote-data-ts";

const useSwrRD = <Data = unknown, Error = unknown>(
  key: Key
): RD.RemoteData<Error, Data> => {
  const { data, error, isValidating } = useSWR<Data, Error>(key);
  if (error) return RD.failure(error);
  if (!data || isValidating) return RD.pending;
  return RD.success(data);
};

export default useSwrRD;
