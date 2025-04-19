const env = require("./index");

const config = env({
  PORT: { type: "number", default: 3000 },
  API_KEY: { required: true },
  DEBUG_MODE: { type: "boolean", default: false },
});

console.log("✅ Final ENV Config:", config);
