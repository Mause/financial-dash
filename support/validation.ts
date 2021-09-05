import { validateOrReject } from "class-validator";
import { VercelRequest } from "@vercel/node";

export async function validate<T>(
  req: VercelRequest,
  build: (o: object) => T
): Promise<T> {
  const request = build(
    typeof req.body === "string" ? JSON.parse(req.body) : req.body
  );
  console.log(request);
  await validateOrReject(request as unknown as object);
  return request;
}
