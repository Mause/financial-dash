import "@testing-library/jest-dom";

import { act, render, RenderResult, screen } from "@testing-library/react";
import App, { BillCard, PaymentWithPayer } from "./App";
import { Provider } from "react-supabase-fp";
import { SupabaseClient } from "@supabase/supabase-js";
import { EnterPaymentModal } from "./modals/EnterPaymentModal";
import _ from "lodash";
import { SWRConfig } from "swr";
import { components } from "./types/up";

test("renders learn react link", async () => {
  await act(async () => {
    const expected = new ExpectPromises([[]]);
    const supa = {
      auth: {
        onAuthStateChange() {
          return {
            data: {
              unsubscribe: NOOP,
            },
          };
        },
        session() {
          return {};
        },
      },
      from() {
        return {
          select() {
            return expected;
          },
        };
      },
    };
    render(
      <Provider value={supa as unknown as SupabaseClient}>
        <App />
      </Provider>,
    );
    await expected.all();
  });

  const linkElement = screen.getByText(/loading/i);
  expect(linkElement).toBeInTheDocument();
});

class ExpectPromises {
  promises: Promise<unknown>[];
  resolvers: (() => void)[];

  constructor(responses: unknown[]) {
    this.promises = [];
    this.resolvers = [];
    for (const response of responses) {
      let resolve: ((v: unknown) => void) | undefined;
      const promise = new Promise<unknown>((_resolve) => {
        resolve = _resolve;
      });
      this.promises.push(promise);
      this.resolvers.push(resolve!.bind(promise, response));
    }
  }

  then() {
    const resolve = this.resolvers.pop();
    if (resolve) resolve();
  }

  async all(): Promise<void> {
    await Promise.all(this.promises);
  }
}

test("Bill", async () => {
  const expected = new ExpectPromises([2]);

  const supa = {
    from() {
      return {
        delete() {
          return { eq: () => expected, in: () => expected };
        },
      };
    },
  };
  let el: RenderResult;

  await act(async () => {
    el = render(
      <Provider value={supa as unknown as SupabaseClient}>
        <BillCard
          row={{
            id: 0,
            billDate: "2021-01-01",
            amount: 1111,
            Payment: [
              {
                id: 0,
                amount: 500,
                invoice_ninja_id: "aaa",
                Payer: { id: 0, name: "Fred", invoice_ninja_id: "" },
                paidFor: -1,
                paidBy: -1,
              },
            ],
            Vendor: { id: 0, name: "Synergy" },
          }}
          setSelectedPayment={NOOP}
          refresh={NOOP}
          setShowModal={NOOP}
        />
      </Provider>,
    );
  });
  expect(el!.container).toMatchSnapshot();

  await act(async () => {
    screen.getByText("Delete").click();
    await expected.all();
  });

  expect(el!.container).toMatchSnapshot();
});

test("EnterPaymentModal", async () => {
  const fetcher = async function (): Promise<
    components["schemas"]["UpTransactionResponse"]
  > {
    return {
      items: [
        {
          id: "0000",
          attributes: {
            amount: {
              value: "10.00",
              valueInBaseUnits: 1000,
            },
            description: "This is a description",
            createdAt: "2022-01-12T10:33",
            message: "This is a message",
          },
        },
      ],
      links: {},
    };
  };

  const payment: PaymentWithPayer = {
    id: 0,
    paidFor: 0,
    amount: 1500,
    paidBy: 0,
    bankId: "",
    invoice_ninja_id: "aaa",
    Payer: { id: 0, name: "Hello", invoice_ninja_id: "" },
  };
  let el: RenderResult<typeof import("@testing-library/dom/types/queries")>;
  await act(async () => {
    el = render(
      <SWRConfig value={{ fetcher }}>
        <EnterPaymentModal
          refresh={NOOP}
          setShowModal={NOOP}
          selectedPayment={payment}
        />
      </SWRConfig>,
    );
  });
  expect(el!.container).toMatchSnapshot();
});

const NOOP = _.identity;
