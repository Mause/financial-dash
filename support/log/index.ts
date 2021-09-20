import { readdirSync, readFileSync } from "fs";
import pino, { P } from "pino";
import logtail from "./logtail";

console.log("loading", logtail.name, readdirSync(__dirname));

const files = readdirSync(__dirname);

const hasAdapter = files.indexOf("logtail_adapter.js");
const name = hasAdapter ? "logtail_adapter" : "logtail";

console.log(readFileSync(__dirname + "/" + name));

const targets: P.TransportTargetOptions[] = [
  {
    target: "pino-pretty",
    options: { destination: 1 },
    level: "debug",
  },
];

if (process.env.LOGTAIL_TOKEN) {
  targets.push({
    target: __dirname + "/" + name,
    options: {},
    level: "debug",
  });
}

console.log({ targets });

const transport = pino.transport({ targets, worker: {} });

console.log({ transport });

export const log = pino(transport);
