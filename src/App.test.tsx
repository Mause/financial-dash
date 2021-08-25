import "@testing-library/jest-dom";

import { render, RenderResult, screen } from "@testing-library/react";
import App, { Payment, PaymentWithPayer } from "./App";
import { Provider } from "react-supabase-fp";
import { BillCard } from "./App";
import { SupabaseClient } from "@supabase/supabase-js";
import { act } from "@testing-library/react";
import { EnterPaymentModal } from "./modals/EnterPaymentModal";

test("renders learn react link", async () => {
  await act(async () => {
    const expected = new ExpectPromises([[]]);
    const supa = {
      auth: {
        onAuthStateChange(callback: () => {}) {
          return {
            data: {
              unsubscribe: () => {},
            },
          };
        },
        session() {
          return {};
        },
      },
      from(name: string) {
        return {
          select(query: string) {
            return expected;
          },
        };
      },
    };
    render(
      <Provider value={supa as unknown as SupabaseClient}>
        <App />
      </Provider>
    );
    await expected.all();
  });

  const linkElement = screen.getByText(/loading/i);
  expect(linkElement).toBeInTheDocument();
});

class ExpectPromises<T> {
  promises: Promise<T>[];
  resolvers: (() => void)[];
  constructor(responses: any[]) {
    this.promises = [];
    this.resolvers = [];
    for (let response of responses) {
      let resolve: ((v: T) => void) | undefined;
      const promise = new Promise<T>((_resolve) => {
        resolve = _resolve;
      });
      this.promises.push(promise);
      this.resolvers.push(resolve!.bind(promise, response));
    }
  }

  then() {
    let resolve = this.resolvers.pop();
    if (resolve) resolve();
  }

  async all(): Promise<void> {
    await Promise.all(this.promises);
  }
}

test("Bill", async () => {
  let expected = new ExpectPromises([2]);

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

  act(() => {
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
          setSelectedPayment={(a) => {}}
          refresh={() => {}}
          setShowModal={(a) => {}}
        />
      </Provider>
    );
  });
  expect(el!.container).toMatchSnapshot();

  await act(async () => {
    screen.getByText("Delete").click();
    await expected.all();
  });

  expect(el!.container).toMatchSnapshot();
});

test("EnterPaymentModal", () => {
  const payment: PaymentWithPayer = {
    id: 0,
    paidFor: 0,
    amount: 1500,
    paidBy: 0,
    bankId: "",
    invoice_ninja_id: "aaa",
    Payer: { id: 0, name: "Hello", invoice_ninja_id: "" },
  };
  const el = render(
    <EnterPaymentModal
      refresh={() => {}}
      setShowModal={(b) => {}}
      selectedPayment={payment}
    />
  );
  expect(el.container).toMatchSnapshot();
});
