import { VercelRequest, VercelResponse } from "@vercel/node";
import * as IN from "../src/invoice-ninja";

export default function (req: VercelRequest, res: VercelResponse) {
  res.json(IN.paths["/api/v1/clients/create"]);
}
