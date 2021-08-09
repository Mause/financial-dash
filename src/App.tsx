import React from "react";
import "./App.css";
import { definitions } from "./supabase";
import { useFilter, useTable } from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import { None } from "fp-ts/Option";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";

function App() {
  const result = useTable<definitions["Bill"]>("Bill", "*");
  const { data, error } = useSWR("https://launtel.vercel.app/api/transactions");

  const vendors = pipe(
    useTable<definitions["Vendor"]>("Vendor", "*"),
    RD.fold3(
      constant(None),
      (e) => None,
      (s) => s
    )
  );

  return (
    <div className="App">
      <header className="App-header">Financial Dash</header>
      <p>{JSON.stringify(error || data)}</p>
      <p>
        {pipe(
          result,
          RD.fold3(
            constant(<div>Loading...</div>),
            (e) => <div>Query failed: {e}</div>,
            (result) => (
              <>
                <h1>Bills</h1>
                <div>
                  {result.map((row) => (
                    <div key={row.id}>
                      <h2>
                        ${row.amount} — {vendors[row.vendor].name}
                      </h2>
                    </div>
                  ))}
                </div>
              </>
            )
          )
        )}
      </p>
      <p>{process.env.REACT_APP_SUPABASE_URL}</p>
    </div>
  );
}

export default App;
