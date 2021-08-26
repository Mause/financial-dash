import { factory } from "vercel-jwt-auth";
import invoiceninja from "../support/invoiceninja";
import { paths } from "../src/invoice-ninja";

const authenticate = factory(process.env.JWT_SECRET!);

export default authenticate(async function (req, res) {
  const parts = req.url.split("/");
  const invoice_id = parts[parts.length - 1];

  if (req.method === "GET") {
    const path = "/api/v1/invoices/{id}";
    res.json(
      await invoiceninja.get<
        paths[typeof path]["get"]["responses"][200]["application/json"]
      >(path.replace("{id}", invoice_id).data)
    );
  } else {
    res.json(`${req.method} not supported`);
  }
});
