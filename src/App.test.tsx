import React from "react";
import { render, RenderResult, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-supabase-fp";
import { BillCard } from "./App";
import { SupabaseClient } from "@supabase/supabase-js";
import { act } from "@testing-library/react";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/loading/i);
  expect(linkElement).toBeInTheDocument();
});

test("Bill", async () => {
  const supa = {
    from() {
      return {
        delete() {
          return { eq: () => ({}), in: () => ({}) };
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
            Payment: [{ id: 0, amount: 500, Payer: { id: 0, name: "Fred" } }],
            Vendor: { id: 0, name: "Synergy" },
          }}
          setSelectedPayment={(a) => {}}
          setShowModal={(a) => {}}
        />
      </Provider>
    );
  });
  expect(el!.container).toMatchSnapshot();

  act(() => {
    screen.getByText("Delete").click();
  });
});
