import { factory } from "vercel-jwt-auth";
import { VercelRequest, VercelResponse, VercelApiHandler } from "@vercel/node";

export default (handler: VercelApiHandler) => {
  return (req: VercelRequest, res: VercelResponse) => {
    try {
      return factory(process.env.JWT_SECRET!)(handler)(req, res);
    } catch (e) {
      console.error("Error:", e);
      if (Array.isArray(e)) {
        res.status(422);
        res.json(e);
      } else {
        throw e;
      }
    }
  };
};