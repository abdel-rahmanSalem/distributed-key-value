import * as net from "net";
import { handleRequest } from "../controllers/requestHandler";
import Node from "../types/node";
import { startHeartbeat } from "../services/heartbeat";

// Create new instance server
export function createServer(port: number, nodes: Node[]) {
  const server = net.createServer((socket) => {
    // Event handler for incoming data from the client
    socket.on("data", (data) => {
      handleRequest(socket, data, nodes);
    });

    // Event handler for the client connection being closed
    // socket.on("close", (hadError) => {
    //   console.log(`Client disconnected${hadError ? " due to an error." : "."}`);
    // });

    // Event handler for errors on the socket
    socket.on("error", (err) => {
      console.error(`Socket error: ${err.message}`);
    });
  });

  // Start the server and listen on the specified port
  server.listen(port, () => {
    startHeartbeat(nodes);

    console.log(
      `\nDistributed Key-Value Store\n` +
        `-------------------------\n` +
        `Server instance is now running on port ${port}.\n` +
        `This node is part of the distributed key-value store.` +
        `\nWaiting for incoming connections...`
    );
  });

  // Handle errors related to port binding
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Error: Port ${port} is already in use. Please choose a different port.`
      );
    } else {
      console.error(`Error occurred: ${err.message}`);
    }

    process.exit(1);
  });
}
