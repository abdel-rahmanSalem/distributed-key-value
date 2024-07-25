import * as fs from "fs";

export function loadConfig(configFileName: string) {
  return JSON.parse(fs.readFileSync(`./config/${configFileName}`, "utf-8"));
}

// Local store act as global for the system
export const store = new Map<any, any>();
