import {components} from "./types/up";
import React, {MouseEvent, useState} from "react";
import useSWRInfinite from "swr/infinite";
import log from "./log";
import {Button, Form, Notification} from "react-bulma-components";
import _ from "lodash";
import {formatISO, parseISO} from "date-fns";

function getKey(
  pageIndex: number,
  previousPageData: components["schemas"]["UpTransactionResponse"] | null
) {
  if (pageIndex === 0) {
    return "https://up.vc.mause.me/api/up?page[size]=100";
  }
  return previousPageData?.links?.next || null;
}

export function Jetbrains(): JSX.Element {
  const [bankId, setBankId] = useState<string>();
  const { data, size, setSize, error, isValidating } =
    useSWRInfinite<components["schemas"]["UpTransactionResponse"]>(getKey);

  log.info({ data }, "Up transactions");

  return (
    <form>
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
              void setSize(size + 1);
            }}
          >
            Load More
          </Button>
        </Form.Control>
      </Form.Field>

      <hr/>
      <dl>
        <dt>Bank ID</dt>
        <dd>{bankId}</dd>
      </dl>
    </form>
  );
}