import "../../support/sentry";
import { paths } from "../../src/types/invoice-ninja";
import { IsNotEmpty, IsEnum } from "class-validator";
import { authenticate, invoiceninja, validate } from "../../support";
import { log as _log } from "../../support";
import { AxiosResponse } from "axios";

const log = _log.child({ endpoint: "invoice/[invoice]" });

enum Status {
  PAID,
}

class PutInvoice {
  @IsNotEmpty()
  @IsEnum(Status)
  status!: Status;
  constructor(body: unknown) {
    Object.assign(this, body);
  }
}

export default authenticate(async function (req, res) {
  log.info(req?.query, "query");
  const invoice_id = req?.query?.invoice as string | undefined;
  if (!invoice_id) return res.status(422);

  if (req.method === "GET") {
    const path = "/api/v1/invoices/{id}";

    return res
      .status(200)
      .json(
        (
          await invoiceninja.get<
            paths[typeof path]["get"]["responses"][200]["content"]["application/json"]
          >(path.replace("{id}", invoice_id))
        ).data,
      );
  } else if (req.method === "PUT") {
    const path = "/api/v1/invoices/{id}";

    const clientRequest = await validate(req, (t) => new PutInvoice(t));

    return res
      .status(200)
      .json(
        (
          await invoiceninja.put<
            PutInvoice,
            AxiosResponse<
              paths[typeof path]["put"]["responses"][200]["content"]["application/json"]
            >
          >(path.replace("{id}", invoice_id), clientRequest)
        ).data,
      );
  } else {
    return res.status(405).json(`${req.method} not supported`);
  }
});

export const methods = new Set(["GET", "PUT"]);
export const requestShape = PutInvoice.name;
export const responseShape = PutInvoice.name;
export const tags = ["invoice"];
