import { VercelRequest, VercelResponse } from "@vercel/node";

export type Trans = (handler: VercelApiHandler) => VercelApiHandler;

export function makeDecorator(wrapper: Trans) {
  const func = function () {
    return function (
      _target: any,
      _propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const original = descriptor.value;
      descriptor.value = async (req: VercelRequest, res: VercelResponse) => {
        await wrapper(original)(req, res);
      };
    };
  };
  Object.defineProperty(func, "name", { value: wrapper.name });
  return func;
}

export function compose(
  handler: VercelApiHandler,
  layers: Trans[]
): VercelApiHandler {
  let root = handler;

  for (let layer of layers) {
    root = layer(root);
  }

  return root;
}

export type VercelApiHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<unknown>;

export { authenticate, Authenticate } from "./auth";
export { catchErrors, CatchErrors } from "./catchErrors";
export {
  catchValidationErrors,
  CatchValidationErrors,
} from "./catchValidationErrors";
