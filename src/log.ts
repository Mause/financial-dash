import { Logtail } from "@logtail/browser";
import { Logtail as Node } from "@logtail/node";
import { LogtailStream } from "@logtail/bunyan";
import bunyan, { createLogger } from "bunyan";
import { Writable } from "stream";

interface LogEvent {
  time: Date;
  level: number;
  msg: string;
}

class ConsoleStream extends Writable {
  write(record: string | Uint8Array): boolean {
    const rec = JSON.parse(record.toString()) as LogEvent;
    console.log(
      "[%s] %s: %s",
      rec.time.toISOString(),
      bunyan.nameFromLevel[rec.level],
      rec.msg
    );
    return true;
  }
}

const streams: bunyan.Stream[] = [{ stream: new ConsoleStream() }];

if (process.env.REACT_APP_LOGTAIL_SOURCE_TOKEN) {
  const logtail = new Logtail(process.env.REACT_APP_LOGTAIL_SOURCE_TOKEN);
  streams.push({
    stream: new LogtailStream(logtail as unknown as Node),
  });
}

export default createLogger({ name: "financial-dash-app", streams });
