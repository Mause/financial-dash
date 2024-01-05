import type { Trans, VercelApiHandler } from "./types";

export function compose(
  handler: VercelApiHandler,
  layers: Trans[]
): VercelApiHandler {
  let root = handler;

  for (const layer of layers) {
    root = layer(root);
  }

  return root;
}
