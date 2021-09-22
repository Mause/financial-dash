import { useInsert } from "react-supabase-fp";
import * as RD from "@devexperts/remote-data-ts";
import useSWR from "swr";
import { useState, FormEvent } from "react";
import { Modal, Button, Form, Notification } from "react-bulma-components";
import { SetB, Bill } from "../App";

export function ImportBillModal(props: {
  setOpenImportBill: SetB;
  refresh: () => void;
}) {
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
    <Modal.Card
      renderAs="form"
      onSubmit={async (e: FormEvent<unknown>) => {
        e.preventDefault();

        if (!(month && data)) return;

        const amount = data.perMonth[month]?.discounted;
        if (amount == null) return;

        await createBill({
          vendor: 1,
          billDate: month + "-01",
          amount: Math.floor(amount * 100),
        });
      }}
    >
      <Modal.Card.Header>
        <Modal.Card.Title>Import Bill</Modal.Card.Title>
      </Modal.Card.Header>
      <Modal.Card.Body>
        {error && <Notification>{error}</Notification>}
        {RD.isFailure(createBillResult) && (
          <Notification>{createBillResult.error}</Notification>
        )}
        <Form.Field>
          <Form.Label>Select a transaction</Form.Label>
          <Form.Control>
            <Form.Select
              onChange={(e) => setMonth(e.target.value)}
              loading={isValidating}
              required
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
        <Button type="submit">Import</Button>
      </Modal.Card.Footer>
    </Modal.Card>
  );
}
