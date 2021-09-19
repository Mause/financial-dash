import pino, { LogEvent } from "pino";
import PinoPretty from "pino-pretty";
import { Logtail } from "@logtail/node";
import { isString } from "class-validator";
import { LogLevel } from "@logtail/types";

const logtail = new Logtail(process.env.LOGTAIL_TOKEN!);

const prettifier = PinoPretty({});

function wrapper(inputData: string | object) {
  function tryParse(): LogEvent {
    if (isString(inputData)) {
      try {
        return JSON.parse(inputData) as LogEvent;
      } catch (e) {
        return {
          level: { label: "info", value: 0 },
          messages: [inputData],
          bindings: [],
          ts: Date.now(),
        };
      }
    } else {
      return inputData as LogEvent;
    }
  }

  const event = tryParse();

  logtail.log(
    event.messages[0],
    event.level.label as LogLevel,
    event.bindings[0]
  );

  prettifier(inputData);
}

export const log = pino({ prettifier: wrapper });
