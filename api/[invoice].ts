import "../support/sentry";
import invoiceninja from "../support/invoiceninja";
import { paths } from "../src/types/invoice-ninja";
import authenticate from "../support/auth";
import { IsNotEmpty, IsEnum } from "class-validator";
import { validate } from "../support/validation";

enum Status {
  PAID,
}

class PutInvoice {
  @IsNotEmpty()
  @IsEnum(Status)
  status!: Status;
  constructor(body: any) {
    Object.assign(this, body);
  }
}

export default authenticate(async function (req, res) {
  const parts = req.url!.split("/");
  const invoice_id = parts[parts.length - 1];

  if (req.method === "GET") {
    const path = "/api/v1/invoices/{id}";

    return res
      .status(200)
      .json(
        (
          await invoiceninja.get<
            paths[typeof path]["get"]["responses"][200]["content"]["application/json"]
          >(path.replace("{id}", invoice_id))
        ).data
      );
  } else if (req.method === "PUT") {
    const path = "/api/v1/invoices/{id}";

    const clientRequest = await validate(req, (t) => new PutInvoice(t));

    return res
      .status(200)
      .json(
        (
          await invoiceninja.put<
            paths[typeof path]["put"]["responses"][200]["content"]["application/json"]
          >(path.replace("{id}", invoice_id), clientRequest)
        ).data
      );
  } else {
    return res.status(405).json(`${req.method} not supported`);
  }
});
