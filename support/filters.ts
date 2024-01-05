import type { Trans, VercelApiHandler } from "./utilities/types";
import { compose } from "./utilities/compose";
import { catchValidationErrors } from "./utilities/catchValidationErrors";
import { catchErrors } from "./utilities/catchErrors";
import { authenticate } from "./utilities/auth";

const LAYERS: Trans[] = [catchValidationErrors, authenticate, catchErrors];

export default (handler: VercelApiHandler): VercelApiHandler =>
  compose(handler, LAYERS);
