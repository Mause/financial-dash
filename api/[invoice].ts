import { factory } from "vercel-jwt-auth";
import invoiceninja from "../support/invoiceninja";
import { paths } from "../invoiceninja";

const authenticate = factory(process.env.JWT_SECRET!);

export default authenticate(async function (res, req) {
  const parts = res.url.split("/");
  const invoice_id = parts[parts.length - 1];

  if (req.method === "GET") {
    const path = "/api/v1/invoice/{id}";
    res.json(
      await invoiceninja.get<
        paths[typeof path]["get"][200]["application/json"]
      >(path.replace("{id}", invoice_id).data)
    );
  } else {
    res.json(`${req.method} not supported`);
  }
});
