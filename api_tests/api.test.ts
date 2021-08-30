import { createServer } from "vercel-node-server";
import listen from "test-listen";
import axios from "axios";
import routeUnderTest from "../api/invoice";
import { Server } from "net";

let server: Server;
let url: string;

beforeAll(async () => {
  server = createServer(routeUnderTest);
  url = await listen(server);
});

afterAll(() => {
  server.close();
});

it("should return the expected response", async () => {
  const response = await axios.get(url, { params: { name: "Pearl" } });
  expect(response.data).toBe("Hello Pearl");
});
