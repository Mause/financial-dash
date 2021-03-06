import { Logtail } from "@logtail/browser";
import {
  createLogger,
  LogStream,
  ConsoleFormattedStream,
} from "browser-bunyan";
import { Context, LogLevel } from "@logtail/types";

const streams: { stream: LogStream }[] = [
  { stream: new ConsoleFormattedStream() },
];

export function getLogLevel(level: string | number) {
  // Are we dealing with a string log level?
  if (typeof level === "string") {
    switch (level.toLowerCase()) {
      // Trace is ignored
      case "trace":
        throw new Error();
      // Error
      case "fatal":
      case "error":
        return LogLevel.Error;
      // Warn
      case "warn":
        return LogLevel.Warn;
      // Debug
      case "debug":
        return LogLevel.Debug;
    }
  } else if (typeof level === "number") {
    // If level <=, consider it 'tracing' and move on
    if (level <= 10) {
      throw new Error();
    }
    // Debug
    if (level <= 20) {
      return LogLevel.Debug;
    }
    // Info
    if (level <= 30) {
      return LogLevel.Info;
    }
    // Warn
    if (level <= 40) {
      return LogLevel.Warn;
    }
    // Everything above this level is considered an error
    return LogLevel.Error;
  }
  // By default, return info
  return LogLevel.Info;
}

export class LogtailStream {
  constructor(private _logtail: Logtail) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
