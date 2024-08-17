import * as net from "net";
import { input } from "@inquirer/prompts";

const client = new net.Socket();

export function createConnection(port: number) {
  client.connect(port, "localhost", async () => {
    console.log(`Connected to server on port: ${port}`);

    await handleCommands();
  });

  client.on("data", (data) => {
    console.log("Received: " + data.toString());
  });

  client.on("error", (err) => {
    console.error("Connection error:", err.message);
    client.end();
  });

  client.on("close", () => {
    console.log("Connection closed.");
  });
}

async function handleCommands() {
  while (true) {
    const command: string = await input({
      message: "Enter your command (or type 'exit' to quit): ",
    });

    if (command.toLowerCase() === "exit") {
      console.log("Exiting...");
      client.end();
      break;
    }

    client.write(command);
  }
}
