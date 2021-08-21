import { useUpdate } from "react-supabase-fp";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";
import { useState, MouseEvent } from "react";
import { Modal, Button, Form } from "react-bulma-components";
import { formatISO, parseISO } from "date-fns";
import { SetB, Payment, markPaid } from "../App";

export function EnterPaymentModal(props: {
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
