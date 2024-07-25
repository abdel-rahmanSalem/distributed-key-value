import * as net from "net";
import { store } from "../utils/utils";
import { forwardRequest } from "../services/nodeManager";

export function handleRequest(
  socket: net.Socket,
  data: Buffer,
  nodes: string[]
) {
  // Convert incoming data(Buffer) to a string and trim any extraneous whitespace
  const request = data.toString().trim();

  // Request formmat is COM key value >> SET someKey someValue
  const [command = "", key = "", value = "", forwarded = ""] =
    request.split(" ");

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

  // Handle SET command
  if (command === "SET") {
    // Validate key and value for the SET command
    if (!key || !value) {
      console.error("Received incomplete SET command.");
      socket.write("ERROR: SET command must include key and value types.");
      return;
    }

    // Check if the key already exists
    if (store.has(key)) {
      console.error(`Key "${key}" already exists.`);
      socket.write(`ERROR: Key "${key}" already exists, It must be unique.`);
      return;
    }

    // Store the key-value pair in the global store
    store.set(key, value);

    // Log the SET operation
    console.log(`SET Key=${key} value=${value}`);

    // Send a success message to the client
    socket.write(`Success: Key "${key}" has been set with value "${value}".`);

    // Forward the SET request to other nodes
    forwardRequest(command, key, value, nodes, forwarded);
  }
  //Handle GET command
  else if (command === "GET") {
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
  }
  //Handle DEL command
  else if (command === "DEL") {
    if (!key) {
      console.error("Received incomplete DEL command.");
      socket.write("ERROR: DEL command must include key.");
      return;
    }

    // Check if the key exists
    const isKeyExistAndDeleted = store.delete(key);

    // Handle non-exist key
    if (!isKeyExistAndDeleted) {
      // Send an error if the key does not exist
      console.error(`Key "${key}" not found.`);
      socket.write(`ERROR: Key "${key}" not found.`);
    } else {
      // Send success message if the key exists
      console.log(`DEL Key=${key}`);
      socket.write(`Success: Value DELETED for Key "${key}".`);

      // Forward the DEL request to other nodes
      forwardRequest(command, key, "", nodes, forwarded);
    }
  }
}
