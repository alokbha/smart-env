// index.js

const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

function smartEnv(schema = {}, options = {}) {
  const errors = {};
  const parsedEnv = {};

  for (const key in schema) {
    const value = process.env[key];
    const config = schema[key];
    const type = config.type || "string";

    let finalValue = value;

    if (!value && "default" in config) {
      finalValue = config.default;
    }

    if (!finalValue && config.required) {
      errors[key] = `Missing required env: ${key}`;
      continue;
    }

    if (finalValue != null) {
      try {
        switch (type) {
          case "number":
            finalValue = Number(finalValue);
            if (isNaN(finalValue)) throw new Error();
            break;
          case "boolean":
            finalValue = finalValue === "true" || finalValue === true;
            break;
          case "string":
            finalValue = String(finalValue);
            break;
          default:
            throw new Error(`Unknown type "${type}" for ${key}`);
        }
      } catch {
        errors[key] = `Invalid type for ${key}. Expected ${type}`;
      }
    }

    parsedEnv[key] = finalValue;
  }

  if (Object.keys(errors).length > 0) {
    console.error("❌ smart-env validation failed:");
    for (const key in errors) {
      console.error(`  • ${key}: ${errors[key]}`);
    }
    process.exit(1);
  }

  return parsedEnv;
}

module.exports = smartEnv;
