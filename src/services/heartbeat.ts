import * as net from "net";
import Node from "../types/node";
import { recoverNode } from "./nodeManager";
import commands from "../data/commands";

const HEARTBEAT_INTERVAL = 5000;
const HEARTBEAT_TIMEOUT = 3000;

export function startHeartbeat(nodes: Node[]) {
  setInterval(() => {
    nodes.forEach((node) => {
      const { host, port } = node;

      // Validate the node configuration
      if (!host || !port) {
        console.error(`Invalid node configuration: ${JSON.stringify(node)}`);
        return;
      }

      const client = new net.Socket();

      let heartbeatTimeout: NodeJS.Timeout;

      client.connect(Number(port), host, () => {
        client.write("HEARTBEAT");

        // Ensure client is destroyed after heartbeat timeout
        heartbeatTimeout = setTimeout(() => {
          if (!client.destroyed) {
            console.warn(
              `Heartbeat to server on port ${port} timed out. Marking as DEAD.`
            );
            node.status = "DEAD";
            client.destroy();
          }
        }, HEARTBEAT_TIMEOUT);
      });

      // Handle the response expected as "ALIVE"
      client.on("data", async (data) => {
        const response = data.toString().trim();

        clearTimeout(heartbeatTimeout);

        if (response === "ALIVE") {
          if (node.status === "DEAD") {
            node.status = "RECOVER";
            console.log(`Server on port ${port} is RECOVERING...`);
            try {
              await recoverNode(Number(port), host, commands);
              node.status = "RECOVERED";
              console.log(`Server on port ${port} is RECOVERED.`);
            } catch (error) {
              console.error(`Error during node recovery: ${error}`);
              node.status = "RECOVER_FAILED";
            }
          } else if (node.status === "RECOVERED") {
            node.status = "ACTIVE";
            console.log(`Server on port ${port} is ACTIVE and responding...`);
          } else if (node.status === "ACTIVE") {
            console.log(`Server on port ${port} is ACTIVE and responding...`);
          }

          if (node.status === "ACTIVE") {
            client.destroy();
          }
        }
      });

      client.on("error", (err) => {
        clearTimeout(heartbeatTimeout);
        console.warn(
          `Heartbeat to server on port ${port} timed out. Marking as DEAD.`
        );
        node.status = "DEAD";
        client.destroy();
      });

      // Handle client end to prevent further writes after the client has been ended
      client.on("end", () => {
        console.log(`Connection with server on port ${port} ended.`);
        node.status = "DEAD";
      });
    });
  }, HEARTBEAT_INTERVAL);
}
