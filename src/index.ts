import select from "@inquirer/select";
import { createServer } from "./server/server";
import { loadConfig } from "../src/config";

async function start() {
  const configFileName = await select({
    message: "Please choose the server you want to run:",
    choices: [
      {
        name: "Server A",
        value: "config1.json",
        description: "Run Server A on port 3000.",
      },
      {
        name: "Server B",
        value: "config2.json",
        description: "Run Server B on port 3001.",
      },
      {
        name: "Server C",
        value: "config3.json",
        description: "Run Server C on port 3002.",
      },
    ],
  });

  const config = loadConfig(configFileName);

  // Start the server with the loaded configuration
  createServer(config.port, config.nodes);
}

start();
