import * as net from "net";
import { handleRequest } from "../controllers/requestHandler";

// Create new instance server
export function createServer(port: number, nodes: string[] = []) {
  const server = net.createServer((socket) => {
    console.log(`Client connected on port ${port}`);

    // Event handler for incoming data from the client
    socket.on("data", (data) => {
      console.log(`data on port ${port}`);
      handleRequest(socket, data, nodes);
    });

    // Event handler for the client connection being closed
    socket.on("close", (hadError) => {
      console.log(`Client disconnected${hadError ? " due to an error." : "."}`);
    });
  });

  // Start the server and listen on the specified port
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
