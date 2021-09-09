import "../support/sentry";
import authenticate from "../support/auth";
import invoiceninja from "../support/invoiceninja";
import { paths } from "../src/types/invoice-ninja";
import { IsNotEmpty } from "class-validator";
import { validate } from "../support/validation";

class PostPayment {
  @IsNotEmpty()
  client_id!: string;
  @IsNotEmpty()
  amount!: number;
  @IsNotEmpty()
  transaction_reference!: string;
  @IsNotEmpty()
  invoice_id!: string;

  constructor(body: any) {
    Object.assign(this, body);
  }
}

export default authenticate(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(422).json("Bad request");
  }

  const clientRequest = await validate(req, (t) => new PostPayment(t));

  const path = "/api/v1/payments";
  type op = paths[typeof path]["post"];

  const requestBody: op["requestBody"]["content"]["application/json"] = {
    transaction_reference: clientRequest.transaction_reference,
    amount: clientRequest.amount,
  };

  const payment = await invoiceninja.post<op["responses"]["200"]["content"]>(
    path,
    requestBody
  );

  res.status(201);
  res.json(payment.data);
});
