import "./App.css";
import { definitions } from "./supabase";
import {
  useTable,
  useUser,
  useSignIn,
  useSignOut,
  useUpdate,
  Filter,
} from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";
import { useState, MouseEvent } from "react";
import { Button, Form, Heading } from "react-bulma-components";
import { formatISO, parseISO } from "date-fns";
import { User } from "@supabase/supabase-js";

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

  const [bankId, setBankId] = useState<string>();
  const [, updatePayment] = useUpdate<definitions["Payment"]>("Payment");

  return (
    <div className="App">
      <header className="App-header">
        Financial Dash
        {pipe(
          signInResult,
          RD.fold(
            () =>
              O.fold(
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
                (user: User) => <div>{user.email}</div>
              )(user),
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
      <div>
        <Form.Field>
          <Form.Label>Select a transaction</Form.Label>
          <Form.Control>
            <Form.Select
              onChange={(e) => setBankId(e.target.value)}
              loading={isValidating}
            >
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
                <Heading size={1}>Bills</Heading>
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
                            {payment.bankId ? (
                              "Paid"
                            ) : (
                              <Button
                                onClick={(e: MouseEvent<any>) => {
                                  e.preventDefault();
                                  debugger;
                                  markPaid(bankId, payment, updatePayment);
                                }}
                              >
                                Unpaid
                              </Button>
                            )}
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

async function markPaid(
  bankId: string | undefined,
  payment: definitions["Payment"],
  updatePayment: (
    values: Partial<definitions["Payment"]>,
    filter: Filter<definitions["Payment"]>
  ) => Promise<void>
): Promise<void> {
  await updatePayment({ bankId }, (query) => query.eq("id", payment.id));
}

export default App;
