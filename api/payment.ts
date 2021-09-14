import "../support/sentry";
import authenticate from "../support/auth";
import invoiceninja from "../support/invoiceninja";
import { paths } from "../src/types/invoice-ninja";
import { IsNotEmpty, IsString, validateOrReject } from "class-validator";
import { validate } from "../support/validation";

class PostPayment {
  @IsNotEmpty()
  client_id: string;
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  transaction_reference: string;
  @IsNotEmpty()
  invoice_id: string;

  constructor(body: {
    client_id?: string;
    amount?: number;
    transaction_reference?: string;
    invoice_id?: string;
  }) {
    this.client_id = body.client_id!;
    this.amount = body.amount!;
    this.transaction_reference = body.transaction_reference!;
    this.invoice_id = body.invoice_id!;
  }
}
class PaymentResponse extends PostPayment {
  @IsString()
  id!: string;

  constructor(
    body: { id?: string } & {
      client_id?: string;
      amount?: number;
      transaction_reference?: string;
      invoice_id?: string;
    }
  ) {
    super(body);
    this.id = body.id!;
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

  const payment = await invoiceninja.post<
    op["responses"]["200"]["content"]["application/json"]
  >(path, requestBody);

  const responseData = new PaymentResponse(payment.data);
  await validateOrReject(responseData);
  res.status(201).json(responseData);
});

export const methods = new Set(["POST"]);
export const requestShape = PostPayment.name;
export const responseShape = PaymentResponse.name;
export const tags = ["payment"];
