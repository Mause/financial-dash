import React from "react";
import "./App.css";
import { definitions } from "./supabase";
import { useTable, useUser } from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import { toNullable } from "fp-ts/Option";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";

function App() {
  const result = useTable<
    definitions["Bill"] & { Vendor: definitions["Vendor"] }
  >(
    "Bill",
    `
    id,
    amount,
    Vendor (
      id,
      name
    )`
  );
  console.log(result);
  const { data, error } = useSWR("https://launtel.vercel.app/api/transactions");

  const user = useUser();

  return (
    <div className="App">
      <header className="App-header">Financial Dash</header>
      <p>{JSON.stringify(error || data)}</p>
      <p>{pipe(user, toNullable)}</p>
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
                        ${row.amount} — {row.Vendor.name} (#{row.Vendor.id})
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
