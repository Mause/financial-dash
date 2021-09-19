import { Writable } from "stream";
import { Logtail } from "@logtail/node";
import { LogLevel } from "@logtail/types";
import _ from "lodash";
import { isString } from "class-validator";

const logtail = new Logtail(process.env.LOGTAIL_TOKEN!, {
  batchSize: 1,
  batchInterval: 1,
  ignoreExceptions: false,
  syncMax: 1,
});

interface LogEvent {
  level: number;
  pid: number;
  hostname: string;
  time: number;
  [key: string]: string | number;
}

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
  let event: string;
  try {
    event = JSON.parse(event_string);
  } catch (e) {
    console.error(e);
    event = event_string;
  }

  await logtail.log(
    pop(event, "msg") as string,
    remap(pop(event, "level") as Levels),
    _.fromPairs(
      Object.entries(event).map(([key, value]) => [
        key,
        isString(value) ? value : JSON.stringify(value),
      ])
    )
  );
}

type Levels = "debug" | "info" | "error" | "warn";

function remap(level: Levels) {
  switch (level) {
    case "debug":
      return LogLevel.Debug;
    case "error":
      return LogLevel.Error;
    case "info":
      return LogLevel.Info;
    case "warn":
      return LogLevel.Warn;
  }
}
