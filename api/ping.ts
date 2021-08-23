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
  const path = "/api/v1/clients/create";
  type op =
    paths[typeof path]["get"]["responses"][200]["content"]["application/json"];
  const { data } = await axios.get<op>(path);

  res.json(data);
}
