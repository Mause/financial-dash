import pino from "pino";

export const log = pino(
  pino.transport({
    targets: [
      {
        target: "pino-pretty",
        options: { destination: 1 }, // use 2 for stderr
        level: "debug",
      },
      { target: "./logtail.js", options: {}, level: "debug" },
    ],
    worker: {},
  })
);
