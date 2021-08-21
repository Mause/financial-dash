import { useTable, useInsert } from "react-supabase-fp";
import * as RD from "@devexperts/remote-data-ts";
import { useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form, Notification } from "react-bulma-components";
import { SetB, Payment, Payer } from "../App";

export function CreatePaymentModal(props: {
  setShow: SetB;
  bill: number;
  refresh: () => void;
}) {
  const [createPaymentResult, createPayment] = useInsert<Payment>("Payment");
  const [payers] = useTable<Payer>("Payer");
  const [payer, setPayer] = useState<number>();

  if (RD.isSuccess(createPaymentResult)) {
    props.setShow(false);
    props.refresh();
  }

  return (
    <Modal.Card
      renderAs="form"
      onSubmit={async (e: FormEvent<any>) => {
        e.preventDefault();
        await createPayment({
          paidBy: payer,
          paidFor: props.bill,
        });
      }}
    >
      <Modal.Card.Header>
        <Modal.Card.Title>Add Payment</Modal.Card.Title>
      </Modal.Card.Header>
      <Modal.Card.Body>
        {RD.isFailure(createPaymentResult) && (
          <Notification>{createPaymentResult.error}</Notification>
        )}
        <Form.Select
          loading={RD.isPending(payers)}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setPayer(Number(e.target.value));
          }}
        >
          {RD.isSuccess(payers) &&
            payers.value.map((payer) => (
              <option key={payer.id} value={payer.id}>
                {payer.name}
              </option>
            ))}
        </Form.Select>
      </Modal.Card.Body>
      <Modal.Card.Footer>
        <Button type="submit">Create</Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}
