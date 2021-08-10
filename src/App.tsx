import "./App.css";
import { definitions } from "./supabase";
import { useTable, useUser, useSignIn, useSignOut } from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import { toNullable } from "fp-ts/Option";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";
import { useState } from "react";

function money(obj: { amount: number }) {
  return "$" + obj.amount / 100;
}

function App() {
  const result = useTable<
    definitions["Bill"] & {
      Vendor: definitions["Vendor"];
      Payment: Array<definitions["Payment"] & { Payer: definitions["Payer"] }>;
    }
  >(
    "Bill",
    `
    id,
    amount,
    Payment (
      id,
      amount,
      bankId,
      Payer (
        name
      )
    ),
    Vendor (
      id,
      name
    )`
  );
  console.log(result);
  const { data, error } = useSWR("https://launtel.vercel.app/api/transactions");

  const [signInResult, signIn] = useSignIn();
  const [, signOut] = useSignOut();
  const user = useUser();
  const [email, setEmail] = useState<string>();

  return (
    <div className="App">
      <header className="App-header">
        Financial Dash
        {pipe(
          signInResult,
          RD.fold(
            () => (
              <>
                <input
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    signIn({ email });
                  }}
                >
                  Log in
                </button>
              </>
            ),
            constant(<div>Signing in...</div>),
            (error) => <div>{error.toString()}</div>,
            () => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </button>
            )
          )
        )}
      </header>
      <p>
        {data?.length} transactions || {error?.toString()}
      </p>
      <p>{pipe(user, toNullable)?.email}</p>
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
                        #{row.id} — {money(row)} — {row.Vendor.name} (#
                        {row.Vendor.id})
                      </h2>
                      <ul>
                        {row.Payment.map((payment) => (
                          <li key={payment.id}>
                            {payment.Payer.name}
                            {" — "}
                            {money(payment)}
                            {" — "}
                            {payment.bankId ? "Paid" : "Unpaid"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            )
          )
        )}
      </p>
    </div>
  );
}

export default App;
