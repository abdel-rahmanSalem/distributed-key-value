import * as net from "net";
import { loadConfig } from "./utils/utils";
import { handleRequest } from "./requestHandler";

// Define the port on which the server will listen
const config = loadConfig();
const port = config.port;

// Create a new TCP server
const server = net.createServer((socket) => {
  console.log("Client connected");

  // Event handler for incoming data from the client
  socket.on("data", (data) => {
    handleRequest(socket, data);
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
