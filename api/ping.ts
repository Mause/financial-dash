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
  const err = await authenticate<{}>(req, res);
  if (err.hasOwnProperty("error")) {
    res.json((err as any).error);
    return;
  }
  const path = "/api/v1/invoices/create";
  type op =
    paths[typeof path]["get"]["responses"][200]["content"]["application/json"];
  let { data } = await axios.get<op>(path);

  data.line_items = {
    0: {
      cost: 69.81,
      product_cost: 69.81,
      product_key: "Internet",
      quantity: 0.25,
    } as unknown,
  };

  data = await axios.post("/api/v1/invoices", data);

  res.json(data);
}
