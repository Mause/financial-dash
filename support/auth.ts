import { factory } from "vercel-jwt-auth";
import { VercelRequest, VercelResponse, VercelApiHandler } from "@vercel/node";

const authenticate = factory(process.env.JWT_SECRET!);

export default (handler: VercelApiHandler) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await authenticate(handler)(req, res);
    } catch (e) {
      if (Array.isArray(e)) {
        res.status(422);
        res.json(e);
      } else {
        throw e;
      }
    }
  };
};
