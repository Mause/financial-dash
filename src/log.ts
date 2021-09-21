import { Logtail } from "@logtail/browser";
import { Logtail as Node } from "@logtail/node";
import { LogtailStream } from "@logtail/bunyan";
import {
  createLogger,
  LogStream,
  ConsoleFormattedStream,
} from "browser-bunyan";

const streams: { stream: LogStream }[] = [
  { stream: new ConsoleFormattedStream() },
];

if (process.env.REACT_APP_LOGTAIL_SOURCE_TOKEN) {
  const logtail = new Logtail(process.env.REACT_APP_LOGTAIL_SOURCE_TOKEN);
  streams.push({ stream: new LogtailStream(logtail as unknown as Node) });
}

export default createLogger({ name: "financial-dash-app", streams });
