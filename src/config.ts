import path from "path";
import * as fs from "fs";

export function getConfigName(): string {
  const configFileName = process.argv[2];

  if (!configFileName) {
    throw new Error(
      "Configuration file name is required.\nUsage: npx ts-node src/index.ts <configFileName>"
    );
  }
  return configFileName;
}

export function loadConfig(configFileName: string) {
  const configPath = path.resolve(__dirname, "..", "config", configFileName);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found "${configFileName}".`);
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
