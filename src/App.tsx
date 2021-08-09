import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { definitions } from "./supabase";
import { useFilter, useTable } from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import * as RD from "@devexperts/remote-data-ts";

function App() {
  const filter = useFilter<definitions["Bill"]>((query) =>
    query.contains("text", "production")
  );
  const result = useTable<definitions["Bill"]>("Bill", "*", filter);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
