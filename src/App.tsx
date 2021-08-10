import "./App.css";
import { definitions } from "./supabase";
import { useTable, useUser, useSignIn, useSignOut } from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import { toNullable } from "fp-ts/Option";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";
import { useState } from "react";
import { Form } from "react-bulma-components";
import { formatISO, parseISO } from "date-fns";

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
  const { data, error, isValidating } = useSWR<
    {
      id: string;
      attributes: { description: string; message: string; createdAt: string };
    }[]
  >("https://launtel.vercel.app/api/up");

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
                  type="email"
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
            (error) => (
              <div>
                {error.message === "Did not return a session"
                  ? "Please check your email inbox for a signin link"
                  : error.message}
              </div>
            ),
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
      <div>
        <Form.Field>
          <Form.Label>Select a transaction</Form.Label>
          <Form.Control>
            <Form.Select loading={isValidating}>
              {data?.map((transaction) => (
                <option key={transaction.id} value={transaction.id}>
                  {formatISO(parseISO(transaction.attributes.createdAt), {
                    representation: "date",
                  })}
                  {" — "}
                  {transaction.attributes.description}
                  {" — "}
                  {transaction.attributes.message}
                </option>
              ))}
            </Form.Select>
          </Form.Control>
        </Form.Field>
      </div>
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
