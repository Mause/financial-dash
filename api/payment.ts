import "../support/sentry";
import authenticate from "../support/auth";
import invoiceninja from "../support/invoiceninja";
import { paths, components } from "../src/types/invoice-ninja";
import { IsNotEmpty, IsString, validateOrReject } from "class-validator";
import { validate } from "../support/validation";
import { AxiosError } from "axios";
import { log } from "../support";

class PostPayment {
  @IsNotEmpty()
  client_id!: string;
  @IsNotEmpty()
  amount!: number;
  @IsNotEmpty()
  transaction_reference!: string;
  @IsNotEmpty()
  invoice_id!: string;

  constructor(body: unknown) {
    Object.assign(this, body);
  }
}
class PaymentResponse {
  @IsString()
  id: string;
  @IsNotEmpty()
  client_id: string;

  constructor(body: { id?: string; client_id?: string }) {
    this.id = body.id!;
    this.client_id = body.client_id!;
  }
}

async function getTemplate() {
  const path = "/api/v1/payments/create";
  return (await invoiceninja.get<components["schemas"]["Payment"]>(path)).data;
}

export default authenticate(async function (req, res) {
  if (req.method !== "POST") {
    return res.status(422).json("Bad request");
  }

  const clientRequest = await validate<unknown, PostPayment>(
    req,
    (t) => new PostPayment(t)
  );

  const path = "/api/v1/payments";
  type op = paths[typeof path]["post"];

  const requestBody = await getTemplate();
  requestBody.transaction_reference = clientRequest.transaction_reference;
  requestBody.client_id = clientRequest.client_id;
  //requestBody.amount = clientRequest.amount / 100,
  requestBody.invoices = [
    {
      invoice_id: clientRequest.invoice_id,
      amount: String(clientRequest.amount / 100),
    },
  ];
  log.info({ requestBody }, 'Payment request body');

  let payment;
  try {
    payment = (
      await invoiceninja.post<{
        data: op["responses"]["200"]["content"]["application/json"];
      }>(path, requestBody)
    ).data;
  } catch (e) {
    if ((e as { isAxiosError: boolean }).isAxiosError)
      log.error((e as AxiosError).response!.data);
    throw e;
  }
  log.info({ payment }, "Created payment");

  const responseData = new PaymentResponse({
    id: payment.data.id,
    client_id: payment.data.client_id,
  });
  await validateOrReject(responseData);
  res.status(201).json(responseData);
});

export const methods = new Set(["POST"]);
export const requestShape = PostPayment.name;
export const responseShape = PaymentResponse.name;
export const tags = ["payment"];
