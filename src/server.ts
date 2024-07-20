import * as net from "net";

// Define the port on which the server will listen
const port = process.env.PORT || 3000;

// Global map to store key-value pairs
const store = new Map<any, any>();

// Create a new TCP server
const server = net.createServer((socket) => {
  console.log("Client connected");

  // Event handler for incoming data from the client
  socket.on("data", (data) => {
    // Convert incoming data(Buffer) to a string and trim any extraneous whitespace
    const request = data.toString().trim();

    // Request form is COM key value >> SET someKey someValue
    const [command = "", key = "", value = ""] = request.split(" ");

    // Validate the request commands
    const validCommand =
      command === "GET" || command === "SET" || command === "DEL";

    // Handle invalid or empty commands
    if (!command || !validCommand) {
      console.error("Received an empty or invalid command.");
      socket.write(
        "ERROR: Invalid or empty command. Please send a valid command."
      );
      return;
    }

    // Handle the SET command
    if (command === "SET") {
      // Validate key and value for the SET command
      if (!key || !value) {
        console.error("Received incomplete SET command.");
        socket.write("ERROR: SET command must include key and value types.");
        return;
      }

      // Store the key-value pair in the global store
      store.set(key, value);

      // Log the SET operation
      console.log(`SET Key=${key} value=${value}`);

      // Send a success message to the client
      socket.write(`Success: Key "${key}" has been set with value "${value}".`);
    }
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
