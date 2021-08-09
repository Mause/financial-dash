import React from "react";
import "./App.css";
import { definitions } from "./supabase";
import { useFilter, useTable } from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";

function App() {
  const filter = useFilter<definitions["Bill"]>((query) =>
    query.contains("text", JSON.stringify("production"))
  );
  const result = useTable<definitions["Bill"]>("Bill", "*", filter);
  const { data, error } = useSWR('https://launtel.vercel.app/api/transactions');

  return (
    <div className="App">
      <header className="App-header">Financial Dash</header>
      <p>
        {JSON.stringify(error || data)}
      </p>
      <p>
        {pipe(
          result,
          RD.fold3(
            constant(<div>Loading...</div>),
            (e) => <div>Query failed: {e}</div>,
            (result) => (
              <>
                <h1>Production text</h1>
                <div>
                  {result.map((row) => (
                    <div key={row.id}>
                      <h2>{row.text}</h2>
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
