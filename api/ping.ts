import { VercelRequest, VercelResponse } from "@vercel/node";
import { paths } from "../src/invoice-ninja";
import Axios from "axios";
import { authenticate } from "vercel-jwt-auth";

const axios = Axios.create({
  baseURL: "https://api.invoicing.co",
  headers: {
    "X-Api-Secret": process.env.INVOICE_NINJA_SECRET,
    "X-Api-Token": process.env.INVOICE_NINJA_TOKEN,
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default async function (req: VercelRequest, res: VercelResponse) {
  const err = await authenticate(req, res);
  console.log(err, { hasAuth: !!req.headers.authorization });
  if (err.hasOwnProperty("error")) {
    res.json((err as any).error);
    return;
  }
  const path = "/api/v1/invoices/create";
  type op =
    paths[typeof path]["get"]["responses"][200]["content"]["application/json"];
  let { data } = await axios.get<op>(path);

  data.client_id = req.body.client_id;
  const cost = Number(req.body.amount) / 100;

  data.date = new Date().toISOString();

  data.line_items = {
    0: {
      cost,
      product_cost: cost,
      product_key: "Internet",
      quantity: 1,
    } as unknown,
  };

  console.log('pre', JSON.stringify(data, undefined, 2));

  const response = await axios.post("/api/v1/invoices", data);

  console.log('post', JSON.stringify(response.data, undefined, 2));

  res.json(response.data);
}
