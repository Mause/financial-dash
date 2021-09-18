import "./App.css";
import { definitions } from "./types/supabase";
import {
  useTable,
  useUser,
  useSignIn,
  useSignOut,
  useFilter,
  useDelete,
} from "react-supabase-fp";
import { pipe, constant } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as RD from "@devexperts/remote-data-ts";
import { useState, MouseEvent, Fragment } from "react";
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
import { User } from "@supabase/supabase-js";
import * as Sentry from "@sentry/react";
import { CreatePaymentModal } from "./modals/CreatePaymentModal";
import { EnterPaymentModal } from "./modals/EnterPaymentModal";
import { ImportBillModal } from "./modals/ImportBillModal";

export type Payment = definitions["Payment"];
export type Bill = definitions["Bill"];
export type Payer = definitions["Payer"];
type Vendor = definitions["Vendor"];
export type PaymentWithPayer = Payment & { Payer: Payer };
type BillRow = Pick<Bill, "id" | "amount" | "billDate"> & {
  Vendor: Vendor;
  Payment: Array<PaymentWithPayer>;
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
      invoice_ninja_id,
      Payer (
        name,
        invoice_ninja_id
      )
    ),
    Vendor (
      id,
      name
    )`
  );
  console.log("result", result);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithPayer>();
  const [openImportBill, setOpenImportBill] = useState(false);

  return (
    <div className="App">
      {showModal && (
        <Modal show={true} onClose={() => setShowModal(false)}>
          <EnterPaymentModal
            setShowModal={setShowModal}
            selectedPayment={selectedPayment!}
            refresh={refresh}
          />
        </Modal>
      )}
      {openImportBill && (
        <Modal show={true} onClose={() => setOpenImportBill(false)}>
          <ImportBillModal
            setOpenImportBill={setOpenImportBill}
            refresh={refresh}
          />
        </Modal>
      )}
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
                      <Fragment key={row.id}>
                        <BillCard
                          setSelectedPayment={setSelectedPayment}
                          setShowModal={setShowModal}
                          row={row}
                          refresh={refresh}
                        />
                        <br />
                      </Fragment>
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
export type SetB = (b: boolean) => void;

export function BillCard({
  row,
  refresh,
  setSelectedPayment,
  setShowModal,
}: {
  row: BillRow;
  setSelectedPayment: (payment: PaymentWithPayer) => void;
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
  const [createPaymentModal, setCreatePaymentModal] = useState<boolean>(false);

  const comb = RD.combine(result, deletePaymentsResult);

  if (RD.isSuccess(comb)) {
    refresh();
  }

  return (
    <Card key={row.id}>
      {createPaymentModal && (
        <Modal onClose={() => setCreatePaymentModal(false)} show={true}>
          <CreatePaymentModal
            setShow={setCreatePaymentModal}
            bill={row}
            refresh={refresh}
          />
        </Modal>
      )}
      <Card.Header>
        <Card.Header.Title>
          #{row.id} — {row.billDate} — {money(row)} — {row.Vendor.name} (#
          {row.Vendor.id})
          <Button.Group>
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
            <Button
              size="small"
              onClick={(e: MouseEvent<any>) => {
                e.preventDefault();
                setCreatePaymentModal(true);
              }}
            >
              Add payment
            </Button>
          </Button.Group>
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
                    <Form.Label textColor="white">Email</Form.Label>
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

export default App;
