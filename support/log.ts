import { LogtailStream } from "@logtail/bunyan";
import { Logtail } from "@logtail/node";
import bunyan from "bunyan";

const streams: bunyan.Stream[] = [{ stream: process.stdout }];

if (process.env.LOGTAIL_TOKEN) {
  streams.push({
    stream: new LogtailStream(
      new Logtail(process.env.LOGTAIL_TOKEN, {
        batchSize: 1,
        batchInterval: 1,
        ignoreExceptions: false,
        syncMax: 1,
      })
    ),
  });
}

export const log = bunyan.createLogger({
  name: "Example logger",
  level: "debug",
  streams,
});
