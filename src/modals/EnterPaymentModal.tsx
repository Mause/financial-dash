import { useUpdate } from "react-supabase-fp";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";
import { useState, FormEvent } from "react";
import { Modal, Button, Form, Notification } from "react-bulma-components";
import { formatISO, parseISO } from "date-fns";
import { SetB, Payment, PaymentWithPayer } from "../App";
import { components } from "../types/up";
import { PaymentApi } from "../financial-dash";
import useApi from "../use_api";

export function EnterPaymentModal(props: {
  setShowModal: SetB;
  selectedPayment: PaymentWithPayer;
  refresh: () => void;
}) {
  const [bankId, setBankId] = useState<string>();
  const [result, updatePayment] = useUpdate<Payment>("Payment");
  const { data, error, isValidating } = useSWR<
    components["schemas"]["UpTransactionResponse"]
  >("https://up.vc.mause.me/api/up");

  if (RD.isSuccess(result)) {
    props.setShowModal(false);
    props.refresh();
  }

  const paymentClient = useApi(PaymentApi);

  console.log(data);

  return (
    <Modal.Card
      renderAs="form"
      onSubmit={async (e: FormEvent<any>) => {
        e.preventDefault();
        await paymentClient.postPayment({
          client_id: props.selectedPayment.Payer.invoice_ninja_id,
          amount: String(props.selectedPayment.amount!),
          invoice_id: props.selectedPayment.invoice_ninja_id,
          transaction_reference: bankId!,
        });
        await updatePayment({ bankId }, (query) =>
          query.eq("id", props.selectedPayment.id)
        );
      }}
    >
      <Modal.Card.Header>
        <Modal.Card.Title>
          Enter payment for {props.selectedPayment.Payer.name}
        </Modal.Card.Title>
      </Modal.Card.Header>
      <Modal.Card.Body>
        {error && <Notification>{JSON.stringify(error)}</Notification>}
        <Form.Field>
          <Form.Label>Select a transaction</Form.Label>
          <Form.Control>
            <Form.Select
              required
              onChange={(e) => setBankId(e.target.value)}
              loading={isValidating}
            >
              <option value="">Select a transaction</option>
              {data?.items.map((transaction) => (
                <option key={transaction.id} value={transaction.id}>
                  {formatISO(parseISO(transaction.attributes.createdAt), {
                    representation: "date",
                  })}
                  {" — "}${transaction.attributes.amount.value}
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
        <Button type="submit">Pay</Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}
