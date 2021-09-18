import { factory } from "vercel-jwt-auth";
import { VercelRequest, VercelResponse } from "@vercel/node";
import * as Sentry from "@sentry/node";
import pino from "pino";

const log = pino({ prettyPrint: true });
const authenticate = factory(process.env.JWT_SECRET!);

type VercelApiHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<unknown>;
type Trans = (handler: VercelApiHandler) => VercelApiHandler;

function compose(handler: VercelApiHandler, layers: Trans[]): VercelApiHandler {
  let root = handler;

  for (let layer of layers) {
    root = layer(root);
  }

  return root;
}

const catchValidationErrors: Trans =
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

const catchErrors: Trans =
  (handler) => async (req: VercelRequest, res: VercelResponse) => {
    try {
      await handler(req, res);
    } catch (e) {
      log.error({ error: e }, "Uncaught error");
      Sentry.captureException(e);
      throw e;
    }
  };

const LAYERS: Trans[] = [catchValidationErrors, authenticate, catchErrors];

export default (handler: VercelApiHandler) => {
  return compose(handler, LAYERS);
};
