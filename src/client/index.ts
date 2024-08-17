import { select } from "@inquirer/prompts";
import { createConnection } from "./client";

async function main() {
  const port: number = await select({
    message: "Which server instance do you want to interact with?",
    choices: [
      {
        name: "Server Instance A",
        value: 3000,
        description: "Connect to Server A running on port 3000.",
      },
      {
        name: "Server Instance B",
        value: 3001,
        description: "Connect to Server B running on port 3001.",
      },
      {
        name: "Server Instance C",
        value: 3002,
        description: "Connect to Server C running on port 3002.",
      },
    ],
  });

  createConnection(port);
}

main();
