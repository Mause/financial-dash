import { readdirSync } from "fs";
import pino, { P } from "pino";
import logtail from "./logtail";

console.log("loading", logtail.name, readdirSync(__dirname));

const targets: P.TransportTargetOptions[] = [
  {
    target: "pino-pretty",
    options: { destination: 1 },
    level: "debug",
  },
];

if (process.env.LOGTAIL_TOKEN) {
  targets.push({ target: __dirname + "/logtail", options: {}, level: "debug" });
}

console.log({ targets });

const transport = pino.transport({ targets, worker: {} });

console.log({ transport });

export const log = pino(transport);
