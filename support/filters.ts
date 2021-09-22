import {
  authenticate,
  catchErrors,
  catchValidationErrors,
  compose,
  Trans,
  VercelApiHandler,
} from "./utilities";

const LAYERS: Trans[] = [catchValidationErrors, authenticate, catchErrors];

export default (handler: VercelApiHandler) => compose(handler, LAYERS);
