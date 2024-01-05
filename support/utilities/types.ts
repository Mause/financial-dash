import { VercelRequest, VercelResponse } from "@vercel/node";

export type Trans = (handler: VercelApiHandler) => VercelApiHandler;

export type VercelApiHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<unknown>;
