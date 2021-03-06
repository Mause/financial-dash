import { LogtailStream } from "@logtail/bunyan";
import { Logtail } from "@logtail/node";
import bunyan from "bunyan";
// eslint-disable-next-line
const pretty = require("@mechanicalhuman/bunyan-pretty");

const streams: bunyan.Stream[] = [{ stream: pretty(process.stdout) }];

if (process.env.LOGTAIL_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_TOKEN, {
    batchInterval: 1,
    ignoreExceptions: false,
  });
  logtail.info("Starting up...");
  streams.push({ stream: new LogtailStream(logtail), reemitErrorEvents: true });
}

export const log = bunyan.createLogger({
  name: "financial-dash",
  level: "debug",
  streams,
});
