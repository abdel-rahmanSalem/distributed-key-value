import * as net from "net";

// Create a new instance of a TCP socket client
const client = new net.Socket();

// Connect to the TCP server at localhost on port 3002 which is server C
client.connect(3002, "localhost", () => {
  console.log("Connected to server C.");

  // Send a DEL command with key and value to the server
  client.write("DEL testKey");
});

// Event handler for incoming data from the server
client.on("data", (data) => {
  // Log the data received from the server
  console.log("Received: " + data.toString());

  // Close the connection after receiving the response
  client.destroy();
});

// Event handler for the connection being closed
client.on("close", () => {
  console.log("Connection closed.");
});

// Event handler for errors occurring with the client
client.on("error", (err) => {
  // Log any errors that occur
  console.error("Error: " + err.message);
});
