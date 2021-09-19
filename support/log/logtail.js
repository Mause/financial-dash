console.time("compiling");
const ts = require("ts-node");
ts.register({
  compilerOptions: { module: "CommonJS" },
});
console.timeLog("compiling");
module.exports = require("./logtail.ts").default;
console.timeEnd("compiling");
