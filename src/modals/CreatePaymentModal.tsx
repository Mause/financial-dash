import { useTable, useInsert } from "react-supabase-fp";
import * as RD from "@devexperts/remote-data-ts";
import { useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form, Notification } from "react-bulma-components";
import { SetB, Bill, Payment, Payer } from "../App";
import { InvoiceApi } from "@mause/financial-dash";
import AxiosStatic from "axios";
import useApi from "../use_api";

export function CreatePaymentModal(props: {
  setShow: SetB;
  bill: Pick<Bill, "id" | "amount">;
  refresh: () => void;
}): JSX.Element {
  const [createPaymentResult, createPayment] = useInsert<Payment>("Payment");
  const [payers] = useTable<Payer>("Payer");
  const [payer, setPayer] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const invoiceApi = useApi(InvoiceApi);
  const [error, setError] = useState<string>();

  if (RD.isSuccess(createPaymentResult)) {
    props.setShow(false);
    props.refresh();
  }

  return (
    <Modal.Card
      renderAs="form"
      onSubmit={async (e: FormEvent<unknown>) => {
        e.preventDefault();

        if (!RD.isSuccess(payers)) return;

        let res;
        try {
          res = await invoiceApi.postInvoice({
            clientId: payers.value.find((p) => p.id === payer)!
              .invoice_ninja_id,
            amount: String(amount!),
          });
        } catch (e) {
          if (e && AxiosStatic.isAxiosError(e) && e.response) {
            setError(JSON.stringify(e.response.data));
          } else {
            setError((e as Record<string, unknown>).toString());
          }
          return;
        }

        await createPayment({
          paidBy: payer,
          amount,
          paidFor: props.bill.id,
          invoice_ninja_id: res.data.data.id,
        });
      }}
    >
      <Modal.Card.Header>
        <Modal.Card.Title>Add Payment</Modal.Card.Title>
      </Modal.Card.Header>
      <Modal.Card.Body>
        {error && <Notification>{error}</Notification>}
        {RD.isFailure(createPaymentResult) && (
          <Notification>{createPaymentResult.error}</Notification>
        )}
        <Form.Field>
          <Form.Control>
            <Form.Select
              loading={RD.isPending(payers)}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setPayer(Number(e.target.value));
              }}
              required
            >
              <option value="">Select a payer</option>
              {RD.isSuccess(payers) &&
                payers.value.map((payer) => (
                  <option key={payer.id} value={payer.id}>
                    {payer.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Control>
        </Form.Field>
        <Form.Field kind="addons">
          <Form.Control>
            <Button isStatic={true}>$</Button>
          </Form.Control>
          <Form.Control>
            <Form.Input
              name="amount"
              placeholder="Amount"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setAmount(Number(e.target.value) * 100);
              }}
            ></Form.Input>
          </Form.Control>
        </Form.Field>

        <Form.Field kind="addons">
          <Form.Control>
            <Button isStatic={true}>%</Button>
          </Form.Control>
          <Form.Control>
            <Form.Input
              name="percentage"
              placeholder="Percentage"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setAmount(props.bill.amount * (Number(e.target.value) / 100));
              }}
            ></Form.Input>
          </Form.Control>
        </Form.Field>
      </Modal.Card.Body>
      <Modal.Card.Footer>
        <Button type="submit">Create</Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}
