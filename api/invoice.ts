import "../support/sentry";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { paths } from "../src/types/invoice-ninja";
import invoiceninja from "../support/invoiceninja";
import { factory } from "vercel-jwt-auth";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { validate } from "../support/validation";
import { Type } from "class-transformer";

class PostInvoice {
  @IsNotEmpty()
  clientId!: string;
  @IsNotEmpty()
  amount!: number;
  constructor(body: any) {
    Object.assign(this, body);
  }
}

class InvoiceResponse {
  @Type(() => InvoiceResponseData)
  @ValidateNested()
  data: InvoiceResponseData;

  constructor(data: InvoiceResponseData) {
    this.data = data;
  }
}
class InvoiceResponseData extends PostInvoice {
  @IsNotEmpty()
  id!: string;

  constructor(body: any) {
    super(body);
  }
}

const authenticate = factory(process.env.JWT_SECRET!);

export default authenticate(async function (
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json("Bad method");
  }

  const request = await validate(req, (t) => new PostInvoice(t));

  const path = "/api/v1/invoices/create";
  type op =
    paths[typeof path]["get"]["responses"][200]["content"]["application/json"];
  let { data } = await invoiceninja.get<op>(path);

  data.client_id = request.clientId;
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

export const methods = new Set(["POST"]);
export const requestShape = PostInvoice.name;
export const responseShape = InvoiceResponse.name;
export const tags = ["invoice"];
