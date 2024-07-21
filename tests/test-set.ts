import * as net from "net";

// Create a new instance of a TCP socket client
const client = new net.Socket();

// Connect to the TCP server at localhost on port 3000 which is server A
client.connect(3000, "localhost", () => {
  console.log("Connected to server A.");

  // Send a SET command with key and value to the server
  client.write("SET testKey testValue");
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
