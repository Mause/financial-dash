import { createServer } from "vercel-node-server";
import listen from "test-listen";
import Axios from "axios";
import { Server } from "net";
import { sign } from "jsonwebtoken";
import invoiceninja from "../support/invoiceninja";
import moxios from "moxios";

import * as Sentry from "@sentry/node";
const captureException = jest.spyOn(Sentry, "captureException");

const SECRET = "SECRET";
process.env.JWT_SECRET = SECRET;
process.env.INVOICE_NINJA_TOKEN = "TOKEN";
process.env.INVOICE_NINJA_SECRET = "SECRET";
const axios = Axios.create({
  headers: {
    Authorization:
      "Bearer " +
      sign(
        {
          aud: "authenticated",
        },
        SECRET
      ),
  },
});

testApi("../api/invoice/[invoice]", "GET /invoice/hello", (url) =>
  it("works", async () => {
    moxios.stubOnce("GET", /ident/, {
      response: {},
    });
    const response = await axios.get(url() + "?invoice=ident");
    expect(response.data).toEqual({});
  })
);

testApi("../api/invoice/[invoice]", "PUT /invoice/hello", (url) =>
  it("works", async () => {
    moxios.stubOnce("PUT", /ident/, {
      response: {},
    });
    const response = await axios.put(url() + "?invoice=ident", {
      status: "PAID",
    });
    expect(response.data).toEqual({});
  })
);

testApi("../api/payment", "POST /payment", (url) =>
  it("works", async () => {
    moxios.stubOnce("POST", /.*/, {
      response: {
        data: {
          id: "payment_id",
          client_id: "client_id",
          invoices: [{ invoice_id: "invoice_id" }],
          amount: "1500",
          transaction_reference: "transaction_reference",
        },
      },
    });
    const response = await axios.post(url(), {
      client_id: "client_id",
      invoice_id: "invoice_id",
      transaction_reference: "transaction_reference",
      amount: "1500",
    });
    expect(response.data).toEqual({
      id: "payment_id",
      client_id: "client_id",
    });
  })
);

testApi("../api/payment", "POST /payment (error case)", (url) =>
  it("works", async () => {
    await expect(
      async () => await axios.post(url(), { amount: 1500 })
    ).rejects.toThrow();
  })
);

testApi("../api/payment", "POST /payment (failed downstream call)", (url) =>
  it("works", async () => {
    moxios.stubOnce("POST", /.*/, {
      status: 500,
      response: { error: "Server down" },
    });
    await expect(
      async () =>
        await axios.post(url(), {
          client_id: "client_id",
          invoice_id: "invoice_id",
          transaction_reference: "transaction_reference",
          amount: 1500,
        })
    ).rejects.toThrow();

    expect(captureException).toBeCalledWith(
      new Error("Request failed with status code 500")
    );
  })
);

function testApi(
  apiFunction: string,
  description: string,
  testFunction: (f: () => string) => void
) {
  describe(description, () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
      moxios.install(invoiceninja);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routeUnderTest = require(apiFunction);
      server = createServer(routeUnderTest.default);
      url = await listen(server);
    });

    afterAll(() => {
      server.close();
      moxios.uninstall(invoiceninja);
    });

    testFunction(() => url);
  });
}
