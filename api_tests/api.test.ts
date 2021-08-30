import { createServer } from "vercel-node-server";
import listen from "test-listen";
import axios from "axios";
import { Server } from "net";
import { sign } from "jsonwebtoken";
import invoiceninja from "../support/invoiceninja";
import moxios from "moxios";

let server: Server;
let url: string;

const SECRET = "SECRET";

beforeAll(async () => {
  process.env.JWT_SECRET = SECRET;
  process.env.INVOICE_NINJA_TOKEN = "TOKEN";
  process.env.INVOICE_NINJA_SECRET = "SECRET";
  moxios.install(invoiceninja);

  const routeUnderTest = require("../api/[invoice]");
  server = createServer(routeUnderTest.default);
  url = await listen(server);
});

afterAll(() => {
  server.close();
  moxios.uninstall(invoiceninja);
});

it("should return the expected response", async () => {
  moxios.stubOnce("GET", /ident/, {
    response: {},
  });
  const response = await axios.get(url + "/ident", {
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
  expect(response.data).toEqual({});
});
