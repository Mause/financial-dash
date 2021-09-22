import { validateOrReject } from "class-validator";
import { VercelRequest } from "@vercel/node";
import { log } from ".";

export async function validate<Input, T>(
  req: VercelRequest,
  build: (o: Input) => T
): Promise<T> {
  const request = build(
    typeof req.body === "string" ? JSON.parse(req.body) : req.body
  );
  log.info(request, "request");
  // eslint-disable-next-line @typescript-eslint/ban-types
  await validateOrReject(request as unknown as object);
  return request;
}
