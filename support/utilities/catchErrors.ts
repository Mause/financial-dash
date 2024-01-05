import Sentry from "@sentry/react";
import { VercelRequest, VercelResponse } from "@vercel/node";
import type { Trans } from "./types";
import { log } from "..";
import { makeDecorator } from "./makeDecorator";

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
