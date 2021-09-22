import { useUpdate } from "react-supabase-fp";
import * as RD from "@devexperts/remote-data-ts";
import useSWRInfinite from "swr/infinite";
import { useState, FormEvent, MouseEvent } from "react";
import { Modal, Button, Form, Notification } from "react-bulma-components";
import { formatISO, parseISO } from "date-fns";
import { SetB, Payment, PaymentWithPayer } from "../App";
import { components } from "../types/up";
import { PaymentApi } from "../financial-dash";
import useApi from "../use_api";
import _ from "lodash";
import log from "../log";

function getKey(
  pageIndex: number,
  previousPageData: components["schemas"]["UpTransactionResponse"] | null
) {
  if (pageIndex === 0) {
    return "https://up.vc.mause.me/api/up?page[size]=100";
  }
  return previousPageData?.links?.next || null;
}

export function EnterPaymentModal(props: {
  setShowModal: SetB;
  selectedPayment: PaymentWithPayer;
  refresh: () => void;
}): JSX.Element {
  const [bankId, setBankId] = useState<string>();
  const [result, updatePayment] = useUpdate<Payment>("Payment");
  const { data, size, setSize, error, isValidating } =
    useSWRInfinite<components["schemas"]["UpTransactionResponse"]>(getKey);

  if (RD.isSuccess(result)) {
    props.setShowModal(false);
    props.refresh();
  }

  const paymentClient = useApi(PaymentApi);

  log.info({ data }, "Up transactions");

  return (
    <Modal.Card
      renderAs="form"
      onSubmit={async (e: FormEvent<unknown>) => {
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
        <Form.Label>Select a transaction</Form.Label>
        <Form.Field kind="addons">
          <Form.Control>
            <Button isStatic={true}>Page {size}</Button>
          </Form.Control>
          <Form.Control>
            <Form.Select
              required
              onChange={(e) => setBankId(e.target.value)}
              loading={isValidating}
            >
              <option value="">Select a transaction</option>
              {_.flatMap(data, (page) =>
                page.items.map((transaction) => (
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
                ))
              )}
            </Form.Select>
          </Form.Control>
          <Form.Control>
            <Button
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                setSize(size + 1);
              }}
            >
              Load More
            </Button>
          </Form.Control>
        </Form.Field>
      </Modal.Card.Body>
      <Modal.Card.Footer renderAs={Button.Group}>
        <Button type="submit">Pay</Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}
