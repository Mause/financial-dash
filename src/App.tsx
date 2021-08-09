import React from "react";
import "./App.css";
import { definitions } from "./supabase";
import { useTable } from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";

function App() {
  const result = useTable<definitions["Bill"]>(
    "Bill",
    `
    id,
    amount,
    vendor (
      name
    )`
  );
  console.log(result);
  const { data, error } = useSWR("https://launtel.vercel.app/api/transactions");

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
                        ${row.amount} — Vendor #{row.vendor}
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
