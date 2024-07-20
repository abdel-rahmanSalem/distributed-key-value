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
    } else if (command === "GET") {
      if (!key) {
        console.error("Received incomplete GET command.");
        socket.write("ERROR: GET command must include key.");
        return;
      }

      // Retrieve the desired value
      const retrievedValue = store.get(key);

      // Check if the key exists
      if (retrievedValue !== undefined) {
        // Send the value if the key exists
        console.log(`GET Key=${key} value=${retrievedValue}`);
        socket.write(`Success: Value "${retrievedValue}" for Key "${key}".`);
      } else {
        // Send an error if the key does not exist
        console.error(`Key "${key}" not found.`);
        socket.write(`ERROR: Key "${key}" not found.`);
      }
    } else if (command === "DEL") {
      if (!key) {
        console.error("Received incomplete DEL command.");
        socket.write("ERROR: DEL command must include key.");
        return;
      }

      // Check if the key exists
      const isKeyExistAndDeletd = store.delete(key);

      // Handle non-exist key
      if (!isKeyExistAndDeletd) {
        // Send an error if the key does not exist
        console.error(`Key "${key}" not found.`);
        socket.write(`ERROR: Key "${key}" not found.`);
      } else {
        // Send success message if the key exists
        console.log(`DEL Key=${key}`);
        socket.write(`Success: Value DELETED for Key "${key}".`);
      }
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
