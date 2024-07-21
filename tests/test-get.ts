import * as net from "net";

// Create a new instance of a TCP socket client
const client = new net.Socket();

// Connect to the TCP server at localhost on port 3001 which is server B
client.connect(3001, "localhost", () => {
  console.log("Connected to server B.");

  // Send a GET command with key and value to the server
  client.write("GET testKey");
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
