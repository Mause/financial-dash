import "../support/sentry";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { paths } from "../src/invoice-ninja";
import invoiceninja from "../support/invoiceninja";
import { factory } from "vercel-jwt-auth";
import { validateOrReject, IsNotEmpty } from "class-validator";

class PostInvoice {
  @IsNotEmpty()
  client_id!: string;
  @IsNotEmpty()
  amount!: number;
  constructor(body: any) {
    Object.assign(this, body);
  }
}

const authenticate = factory(process.env.JWT_SECRET!);

export default authenticate(async function (
  req: VercelRequest,
  res: VercelResponse
) {
  const request = new PostInvoice(req.body);
  await validateOrReject(request);

  const path = "/api/v1/invoices/create";
  type op =
    paths[typeof path]["get"]["responses"][200]["content"]["application/json"];
  let { data } = await invoiceninja.get<op>(path);

  data.client_id = request.client_id;
  const cost = request.amount / 100;

  data.date = new Date().toISOString();

  data.line_items = {
    0: {
      cost,
      product_cost: cost,
      product_key: "Internet",
      quantity: 1,
    } as unknown,
  };

  console.log("pre", JSON.stringify(data, undefined, 2));

  const response = await invoiceninja.post("/api/v1/invoices", data);

  console.log("post", JSON.stringify(response.data, undefined, 2));

  res.json(response.data);
});
