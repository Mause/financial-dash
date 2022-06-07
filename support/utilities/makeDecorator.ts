import type { Trans } from "./types";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export function makeDecorator(
  wrapper: Trans
): () => (
  _target: unknown,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  const func = function () {
    return function (
      _target: unknown,
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
