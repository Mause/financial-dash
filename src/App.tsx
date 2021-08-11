import "./App.css";
import { definitions } from "./supabase";
import {
  useTable,
  useUser,
  useInsert,
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
import { Modal, Button, Form, Heading, Card, Container } from "react-bulma-components";
import { formatISO, parseISO } from "date-fns";
import { User } from "@supabase/supabase-js";

type Payment = definitions["Payment"];
type Bill = definitions["Bill"];

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

  const [signInResult, signIn] = useSignIn();
  const [, signOut] = useSignOut();
  const user = useUser();
  const [email, setEmail] = useState<string>();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment>();
  const [openImportBill, setOpenImportBill] = useState(false);

  return (
    <div className="App">
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <EnterPayment
          setShowModal={setShowModal}
          selectedPayment={selectedPayment!}
        />
      </Modal>
      <Modal show={openImportBill} onClose={() => setOpenImportBill(false)}>
        <ImportBill setOpenImportBill={setOpenImportBill} />
      </Modal>
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
                (user: User) => (
                  <div>
                    {user.email} - {user.role}
                  </div>
                )
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
      <Button
        onClick={(e: MouseEvent<any>) => {
          e.preventDefault();
          setOpenImportBill(true);
        }}
      >
        Import Bill
      </Button>
      <p>
        {pipe(
          result,
          RD.fold3(
            constant(<div>Loading...</div>),
            (e) => <div>Query failed: {e}</div>,
            (result) => (
              <>
                <Heading size={1}>Bills</Heading>
                <Container>
                  {result.map((row) => (
                    <Card key={row.id}>
                      <Card.Header>
                        <Card.Header.Title>
                          #{row.id} — {money(row)} — {row.Vendor.name} (#
                          {row.Vendor.id})
                        </Card.Header.Title>
                      </Card.Header>
                      <Card.Content>
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
                                  size="small"
                                  onClick={(e: MouseEvent<any>) => {
                                    e.preventDefault();
                                    setSelectedPayment(payment);
                                    setShowModal(true);
                                  }}
                                >
                                  Unpaid
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Card.Content>
                    </Card>
                  ))}
                </Container>
              </>
            )
          )
        )}
      </p>
    </div>
  );
}
type SetB = (b: boolean) => void;

function ImportBill(props: { setOpenImportBill: SetB }) {
  const [createBillResult, createBill] = useInsert<Bill>("Bill");
  const [month, setMonth] = useState<string>();
  const { data, error, isValidating } = useSWR<{
    perMonth: Record<string, { discounted: number }>;
  }>("https://launtel.vercel.app/api/transactions");

  if (RD.isSuccess(createBillResult)) {
    props.setOpenImportBill(false);
  }

  return (
    <Modal.Card>
      <Modal.Card.Header>
        <Modal.Card.Title>Import Bill</Modal.Card.Title>
      </Modal.Card.Header>
      <Modal.Card.Body>
        {JSON.stringify(error)}
        {JSON.stringify(createBillResult)}
        <Form.Field>
          <Form.Label>Select a transaction</Form.Label>
          <Form.Control>
            <Form.Select
              onChange={(e) => setMonth(e.target.value)}
              loading={isValidating}
            >
              {Object.entries(data?.perMonth ?? {}).map(
                ([month, { discounted }]) => (
                  <option key={month} value={month}>
                    {month}
                    {" — $"}
                    {discounted}
                  </option>
                )
              )}
            </Form.Select>
          </Form.Control>
        </Form.Field>
      </Modal.Card.Body>
      <Modal.Card.Footer renderAs={Button.Group}>
        <Button
          onClick={async (e: MouseEvent<any>) => {
            e.preventDefault();

            await createBill({
              vendor: 1, // Launtel,
              amount: data?.perMonth[month!]?.discounted! * 100,
            });
          }}
        >
          Import
        </Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}

function EnterPayment(props: { setShowModal: SetB; selectedPayment: Payment }) {
  const [bankId, setBankId] = useState<string>();
  const [, updatePayment] = useUpdate<definitions["Payment"]>("Payment");
  const { data, error, isValidating } = useSWR<
    {
      id: string;
      attributes: { description: string; message: string; createdAt: string };
    }[]
  >("https://launtel.vercel.app/api/up");

  return (
    <Modal.Card>
      <Modal.Card.Header>
        <Modal.Card.Title>Enter payment</Modal.Card.Title>
      </Modal.Card.Header>
      <Modal.Card.Body>
        {JSON.stringify(error)}
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
      </Modal.Card.Body>
      <Modal.Card.Footer renderAs={Button.Group}>
        <Button
          onChange={async (e: MouseEvent<any>) => {
            e.preventDefault();
            await markPaid(bankId, props.selectedPayment, updatePayment);
            props.setShowModal(false);
          }}
        >
          Pay
        </Button>
      </Modal.Card.Footer>
    </Modal.Card>
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
