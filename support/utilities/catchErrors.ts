import Sentry from "@sentry/react";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { makeDecorator, Trans } from ".";
import { log } from "..";

export const catchErrors: Trans =
  (handler) => async (req: VercelRequest, res: VercelResponse) => {
    try {
      await handler(req, res);
    } catch (e) {
      log.error({ error: e }, "Uncaught error");
      Sentry.captureException(e);
      throw e;
    }
  };

export const CatchErrors = makeDecorator(catchErrors);
