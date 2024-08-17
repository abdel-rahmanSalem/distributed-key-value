import path from "path";
import * as fs from "fs";

export function loadConfig(configFileName: string) {
  const configPath = path.resolve(__dirname, "..", "config", configFileName);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found "${configFileName}".`);
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
