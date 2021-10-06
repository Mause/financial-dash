import "../support/sentry";
import authenticate from "../support/auth";
import invoiceninja from "../support/invoiceninja";
import { components, paths } from "../src/types/invoice-ninja";
import { IsNotEmpty, IsString, validateOrReject } from "class-validator";
import { validate } from "../support/validation";
import { AxiosError, AxiosResponse } from "axios";
import { log } from "../support";

type ValidationError = components["schemas"]["ValidationError"];
type GenericError = components["schemas"]["Error"];

function isAxiosError(e: unknown): e is AxiosError {
  return (e as { isAxiosError: boolean }).isAxiosError;
}
function isValidationError(
  e: AxiosError<any>
): e is AxiosError<ValidationError> {
  return e.response?.status == 422;
}
function isGenericError(e: AxiosError<any>): e is AxiosError<GenericError> {
  return e.response?.status !== 200 && e.response?.status !== 422;
}

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
  log.info({ requestBody }, "Payment request body");

  let payment;
  try {
    payment = (
      await invoiceninja.post<
        op["requestBody"]["content"]["application/json"],
        AxiosResponse<{
          data: op["responses"]["200"]["content"]["application/json"];
        }>
      >(path, requestBody)
    ).data;
  } catch (e) {
    if (isAxiosError(e)) {
      const errorBody = e.response!.data;
      if (isValidationError(e)) {
        log.error("Validation error occured", errorBody);
      } else {
        log.error("Unknown error occurred", errorBody);
      }
      return res.status(502).json({ invoiceNinjaError: errorBody });
    } else {
      throw e;
    }
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
