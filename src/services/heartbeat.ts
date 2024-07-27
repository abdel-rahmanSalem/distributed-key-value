import * as net from "net";
import Node from "../types/node";

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

      client.connect(Number(port), host, () => {
        client.write("HEARTBEAT");
      });

      client.on("data", (data) => {
        const response = data.toString().trim();
        if (response === "ALIVE") {
          node.isActive = true;
          console.log(`Server hosted on port: ${node.port} is ALIVE`);
        }
        // Ensure the client is destroyed after receiving the response
        client.destroy();
      });

      client.on("error", (err) => {
        console.error(
          `Error sending heartbeat to server hosted on port: ${node.port}, ${err.message}`
        );
        // Ensure the client is destroyed on error
        client.destroy();
      });

      client.on("timeout", () => {
        console.error(
          `Heartbeat timeout for server hosted on port: ${node.port}`
        );
        node.isActive = false;
        client.destroy();
      });

      // Handle client end to prevent further writes after the client has been ended
      client.on("end", () => {
        console.log(
          `Connection ended with server hosted on port: ${node.port}`
        );
      });

      // Ensure client is destroyed after heartbeat timeout
      setTimeout(() => {
        if (!client.destroyed) {
          node.isActive = false;
          console.log(`Server hosted on port: ${node.port} is DEAD`);
          client.destroy();
        }
      }, HEARTBEAT_TIMEOUT);
    });
  }, HEARTBEAT_INTERVAL);
}
