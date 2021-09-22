import { makeDecorator, Trans } from ".";
import { log } from "..";
import { VercelRequest, VercelResponse } from "@vercel/node";

export const catchValidationErrors: Trans =
  (handler) => async (req: VercelRequest, res: VercelResponse) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (Array.isArray(e)) {
        log.error({ errors: e }, "Validation errors");
        res.status(422);
        res.json(e);
      } else {
        throw e;
      }
    }
  };

export const CatchValidationErrors = makeDecorator(catchValidationErrors);
