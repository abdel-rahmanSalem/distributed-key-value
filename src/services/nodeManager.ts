import * as net from "net";
import Node from "../types/node";
import commands from "../data/commands";

export function forwardRequest(
  command: string,
  key: string,
  value: string,
  nodes: Node[],
  forwarded: string
) {
  // check if the request is already forwarded
  if (forwarded) return;

  // Store the command in the command queue(FIFO)
  commands.push(`${command} ${key} ${value}`);

  // Iterate over each node to create socket connection then write the command
  // Each node acting as a server
  nodes.forEach((node: Node) => {
    const { host, port, status } = node;

    if (status !== "ACTIVE") {
      console.error(`Server on port ${port} is NOT ACTIVE.`);
      console.log(status);
      return;
    }

    // Create a new socket connection to the node
    const client = new net.Socket();
    client.connect(Number(port), host, () => {
      console.log(`Connected to server on port ${port}`);
      // Send the command to the node
      client.write(`${command} ${key} ${value} forwarded`);
    });

    // Handle data received from the node
    client.on("data", (data) => {
      // Log the response from the node
      console.log(
        `Response from server on port ${node.port}: ${data.toString()}`
      );

      client.destroy();
    });

    client.on("error", (err) => {
      console.error(`Error with server on port ${node.port}: ${err.message}`);
    });
  });
}

export async function recoverNode(
  port: number,
  host: string,
  commands: string[]
) {
  return new Promise<void>((resolve, reject) => {
    const client = new net.Socket();
    let commandIndex = 0;

    client.connect(port, host, () => {
      console.log(`Connected to server on port ${port} FOR RECOVERING...`);

      if (commands.length === 0) {
        console.log(`No commands to process. Ending connection.`);
        client.end();
        resolve();
        return;
      }

      sendNextCommand();
    });

    client.on("data", (data) => {
      console.log(`Response from server on port ${port}: ${data.toString()}`);
      if (commandIndex >= commands.length) {
        client.end();
      } else {
        sendNextCommand();
      }
    });

    client.on("error", (err) => {
      console.error(`Error with server on port ${port}: ${err.message}`);
      reject(err);
    });

    client.on("end", () => {
      console.log(`Connection to server on port ${port} ended.`);
      resolve();
    });

    function sendNextCommand() {
      if (commandIndex < commands.length) {
        const curCommand = commands[commandIndex++];
        client.write(`${curCommand} forwarded`);
      }
    }
  });
}
