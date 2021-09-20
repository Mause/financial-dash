import pino, { P } from "pino";
import './logtail'; // force inclusion in bundle?

const targets: P.TransportTargetOptions[] = [
  {
    target: "pino-pretty",
    options: { destination: 1 },
    level: "debug",
  },
];

if (process.env.LOGTAIL_TOKEN) {
  targets.push({ target: "./logtail.js", options: {}, level: "debug" });
}

export const log = pino(pino.transport({ targets, worker: {} }));
