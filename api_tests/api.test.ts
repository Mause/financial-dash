import { createServer } from "vercel-node-server";
import listen from "test-listen";
import Axios from "axios";
import { Server } from "net";
import { sign } from "jsonwebtoken";
import invoiceninja from "../support/invoiceninja";
import moxios from "moxios";

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

testApi("../api/[invoice]", "GET /invoice/hello", (url) =>
  it("works", async () => {
    moxios.stubOnce("GET", /ident/, {
      response: {},
    });
    const response = await axios.get(url() + "/ident");
    expect(response.data).toEqual({});
  })
);

testApi("../api/[invoice]", "PUT /invoice/hello", (url) =>
  it("works", async () => {
    moxios.stubOnce("PUT", /ident/, {
      response: {},
    });
    const response = await axios.put(url() + "/ident", { status: "PAID" });
    expect(response.data).toEqual({});
  })
);

testApi("../api/payment", "POST /payment", (url) =>
  it("works", async () => {
    moxios.stubOnce("POST", /.*/, {
      response: { payment_id: "payment_id" },
    });
    const response = await axios.post(url(), {
      client_id: "client_id",
      invoice_id: "invoice_id",
      transaction_reference: "transaction_reference",
      amount: 1500,
    });
    expect(response.data).toEqual({ payment_id: "payment_id" });
  })
);

testApi("../api/payment", "POST /payment (error case)", (url) =>
  it("works", async () => {
    await expect(
      async () => await axios.post(url(), { amount: 1500 })
    ).rejects.toThrow();
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
