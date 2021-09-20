import { Writable } from "stream";
import { Logtail } from "@logtail/node";
import { LogLevel } from "@logtail/types";
import _ from "lodash";
import * as Pino from "pino";

console.log("Loading ts logtail backend");

type Levels = Pino.P.Level;

const logtail = new Logtail(process.env.LOGTAIL_TOKEN!, {
  batchSize: 1,
  batchInterval: 1,
  ignoreExceptions: false,
  syncMax: 1,
});

export default (options: {}) => {
  return new Writable({
    write(chunk: Buffer, enc: string, cb) {
      let decoded = chunk.toString(
        enc === "buffer" ? "utf8" : (enc as BufferEncoding)
      );

      wrapper(decoded).then(() => cb());
    },
  });
};

function pop(thing: any, prop: string): any {
  const value = thing[prop];
  delete thing[prop];
  return value;
}

async function wrapper(event_string: string) {
  const event = JSON.parse(event_string);

  await logtail.log(
    pop(event, "msg") as string,
    remap(pop(event, "level") as Levels),
    event
  );
}

function remap(level: Levels) {
  switch (level) {
    case "debug":
      return LogLevel.Debug;
    case "fatal":
    case "error":
      return LogLevel.Error;
    case "info":
      return LogLevel.Info;
    case "warn":
      return LogLevel.Warn;
  }
}
