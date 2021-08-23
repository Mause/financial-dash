import { VercelRequest, VercelResponse } from "@vercel/node";
import { paths } from "../src/invoice-ninja";
import * as Axios from "axios";

const base = "https://api.invoicing.co";

export default function (req: VercelRequest, res: VercelResponse) {
  const path = "/api/v1/clients/create";
  type op = paths[path]["get"]["responses"][200]["content"]["application/json"];
  const data = await Axios.get<op>(base + path);

  res.json(data);
}
