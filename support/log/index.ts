import pino, { P } from "pino";

const targets: P.TransportTargetOptions[] = [
  {
    target: "pino-pretty",
    options: { destination: 1 },
    level: "debug",
  },
];

if (process.env.LOGTAIL_TOKEN) {
  targets.push({ target: "./logtail", options: {}, level: "debug" });
}

export const log = pino(pino.transport({ targets, worker: {} }));
