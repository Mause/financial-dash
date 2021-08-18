import "./App.css";
import { definitions } from "./supabase";
import {
  useTable,
  useUser,
  useInsert,
  useSignIn,
  useSignOut,
  useUpdate,
  useFilter,
  useDelete,
  Filter,
} from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";
import { useState, MouseEvent } from "react";
import {
  Modal,
  Button,
  Form,
  Heading,
  Columns,
  Notification,
  Card,
  Container,
} from "react-bulma-components";
import { formatISO, parseISO } from "date-fns";
import { User } from "@supabase/supabase-js";
import * as Sentry from "@sentry/react";

type Payment = definitions["Payment"];
type Bill = definitions["Bill"];
type Payer = definitions["Payer"];
type Vendor = definitions["Vendor"];
type BillRow = Pick<Bill, "id" | "amount" | "billDate"> & {
  Vendor: Vendor;
  Payment: Array<Payment & { Payer: Payer }>;
};

function money(obj: { amount: number }) {
  return "$" + obj.amount / 100;
}

function App() {
  const [result, refresh] = useTable<BillRow>(
    "Bill",
    `
    id,
    amount,
    billDate,
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
  console.log("result", result);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment>();
  const [openImportBill, setOpenImportBill] = useState(false);

  return (
    <div className="App">
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <EnterPayment
          setShowModal={setShowModal}
          selectedPayment={selectedPayment!}
          refresh={refresh}
        />
      </Modal>
      <Modal show={openImportBill} onClose={() => setOpenImportBill(false)}>
        <ImportBill setOpenImportBill={setOpenImportBill} refresh={refresh} />
      </Modal>
      <AppHeader></AppHeader>
      <Heading size={1}>
        Bills
        <Button
          onClick={(e: MouseEvent<any>) => {
            e.preventDefault();
            setOpenImportBill(true);
          }}
        >
          Import Bill
        </Button>
      </Heading>
      {pipe(
        result,
        RD.fold3(
          constant(<div>Loading...</div>),
          (e) => <div>Query failed: {e}</div>,
          (result) => (
            <>
              <Container>
                <Columns centered={true}>
                  <Columns.Column size="half">
                    {result.map((row) => (
                      <>
                        <BillCard
                          setSelectedPayment={setSelectedPayment}
                          setShowModal={setShowModal}
                          row={row}
                          refresh={refresh}
                        />
                        <br />
                      </>
                    ))}
                  </Columns.Column>
                </Columns>
              </Container>
            </>
          )
        )
      )}
    </div>
  );
}
type SetB = (b: boolean) => void;

export function BillCard({
  row,
  refresh,
  setSelectedPayment,
  setShowModal,
}: {
  row: BillRow;
  setSelectedPayment: (payment: Payment) => void;
  setShowModal: SetB;
  refresh: () => void;
}) {
  const filter = useFilter<Bill>((query) => query.eq("id", row.id));
  const [result, deleteBill] = useDelete<Bill>("Bill");
  const paymentsFilter = useFilter<Payment>((query) =>
    query.in(
      "id",
      row.Payment.map((payment) => payment.id)
    )
  );
  const [deletePaymentsResult, deletePayments] = useDelete<Payment>("Payment");

  const comb = RD.combine(result, deletePaymentsResult);

  if (RD.isSuccess(comb)) {
    refresh();
  }

  return (
    <Card key={row.id}>
      <Card.Header>
        <Card.Header.Title>
          #{row.id} — {row.billDate} — {money(row)} — {row.Vendor.name} (#
          {row.Vendor.id})
          <Button
            onClick={async (e: MouseEvent<any>) => {
              e.preventDefault();
              await deletePayments(paymentsFilter);
              await deleteBill(filter);
            }}
            size="small"
          >
            Delete
          </Button>
        </Card.Header.Title>
      </Card.Header>
      <Card.Content>
        {RD.isFailure(comb) && <Notification>{comb.error}</Notification>}
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
      <Card.Footer />
    </Card>
  );
}

function ImportBill(props: { setOpenImportBill: SetB; refresh: () => void }) {
  const [createBillResult, createBill] = useInsert<Bill>("Bill");
  const [month, setMonth] = useState<string>();
  const { data, error, isValidating } = useSWR<{
    perMonth: Record<string, { discounted: number }>;
  }>("https://launtel.vercel.app/api/transactions");

  if (RD.isSuccess(createBillResult)) {
    props.setOpenImportBill(false);
    props.refresh();
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
              billDate: month + "-01",
              amount: Math.floor(data?.perMonth[month!]?.discounted! * 100),
            });
          }}
        >
          Import
        </Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}

function EnterPayment(props: {
  setShowModal: SetB;
  selectedPayment: Payment;
  refresh: () => void;
}) {
  const [bankId, setBankId] = useState<string>();
  const [result, updatePayment] = useUpdate<Payment>("Payment");
  const { data, error, isValidating } = useSWR<
    {
      id: string;
      attributes: { description: string; message: string; createdAt: string };
    }[]
  >("https://launtel.vercel.app/api/up");

  if (RD.isSuccess(result)) {
    props.setShowModal(false);
    props.refresh();
  }

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
          }}
        >
          Pay
        </Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}

function AppHeader() {
  const [signInResult, signIn] = useSignIn();
  const [, signOut] = useSignOut();
  const user = useUser();
  const [email, setEmail] = useState<string>();

  pipe(
    user,
    O.fold(
      () => Sentry.setUser(null),
      (u) => Sentry.setUser({ email: u.email, id: u.id })
    )
  );

  const logoutButton = (
    <Button
      size="small"
      onClick={(e: MouseEvent<any>) => {
        e.preventDefault();
        signOut();
      }}
    >
      Sign out
    </Button>
  );

  return (
    <header className="App-header">
      <Heading textColor="white">Financial Dash</Heading>
      {pipe(
        signInResult,
        RD.fold(
          () =>
            O.fold(
              () => (
                <form
                  onSubmit={(e: MouseEvent<any>) => {
                    e.preventDefault();
                    signIn({ email }, { redirectTo: window.location.href });
                  }}
                >
                  <Form.Field>
                    <Form.Label>Email</Form.Label>
                    <Form.Control>
                      <Form.Input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                      />
                    </Form.Control>
                  </Form.Field>
                  <Button type="submit">Log in</Button>
                </form>
              ),
              (user: User) => (
                <div>
                  {user.email} — {user.role} — {logoutButton}
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
          () => logoutButton
        )
      )}
    </header>
  );
}

async function markPaid(
  bankId: string | undefined,
  payment: Payment,
  updatePayment: (
    values: Partial<Payment>,
    filter: Filter<Payment>
  ) => Promise<void>
): Promise<void> {
  await updatePayment({ bankId }, (query) => query.eq("id", payment.id));
}

export default App;
