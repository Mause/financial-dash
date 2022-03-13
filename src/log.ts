import { Logtail } from "@logtail/browser";
import { getLogLevel } from "@logtail/bunyan/dist/es6/helpers";
import {
  createLogger,
  LogStream,
  ConsoleFormattedStream,
} from "browser-bunyan";
import { Context } from "@logtail/types";

const streams: { stream: LogStream }[] = [
  { stream: new ConsoleFormattedStream() },
];

export class LogtailStream {
  constructor(private _logtail: Logtail) {}

  write(log: any) {
    // Log should have string `msg` key, > 0 length
    if (typeof log.msg !== "string" || !log.msg.length) {
      return;
    }
    // Logging meta data
    const meta: Context = {};
    // Copy `time` if set
    if (typeof log.time === "string" || log.time.length) {
      const time = new Date(log.time);
      if (!isNaN(time.valueOf())) {
        meta.dt = time;
      }
    }
    // Carry over any additional data fields
    Object.keys(log)
      .filter((key) => ["time", "msg", "level", "v"].indexOf(key) < 0)
      .forEach((key) => (meta[key] = log[key]));
    // Determine the log level
    let level;
    try {
      level = getLogLevel(log.level);
    } catch (_) {
      return;
    }
    // Log to Logtail
    void this._logtail.log(log.msg, level, meta);
  }
}

if (process.env.REACT_APP_LOGTAIL_SOURCE_TOKEN) {
  const logtail = new Logtail(process.env.REACT_APP_LOGTAIL_SOURCE_TOKEN);
  const stream = new LogtailStream(logtail);
  streams.push({ stream });
}

export default createLogger({ name: "financial-dash-app", streams });
