import { store } from "../utils/utils";
import { forwardRequest } from "./nodeManager";
import Node from "../types/node";

export function setKey(
  key: string,
  value: string,
  forwarded: string,
  nodes: Node[]
): string {
  // Validate Client command >> SET command
  if (!key || !value) {
    console.error("Received incomplete SET command.");
    return `ERROR: SET command must include key and value.`;
  }

  // Check if the key already exists
  if (store.has(key)) {
    console.error(`Key "${key}" already exists.`);
    return `ERROR: Key "${key}" already exists, It must be unique.`;
  }

  // Store the key-value pair in the global store
  store.set(key, value);

  // Log the SET operation
  console.log(`Done: SET Key=${key} value=${value}`);

  // Forward the SET request to other nodes
  forwardRequest("SET", key, value, nodes, forwarded);

  return `Success: Key "${key}" has been set with value "${value}".`;
}

export function getKey(key: string): string {
  // Validate Client command >> GET command
  if (!key) {
    console.error("Received incomplete GET command.");
    return `ERROR: GET command must include key.`;
  }

  // Check if the key exists then Retrieve the desired value
  if (store.has(key)) {
    const retrievedValue = store.get(key);

    // Log the GET operation
    console.log(`Done: GET Key=${key} value=${retrievedValue}`);

    return `Success: Value "${retrievedValue}" for Key "${key}".`;
  } else {
    // Return an error if the key does not exist
    console.error(`Key "${key}" not found.`);
    return `ERROR: Key "${key}" not found.`;
  }
}

export function delKey(key: string, forwarded: string, nodes: Node[]) {
  // Validate Client command >> DEL command
  if (!key) {
    console.error("Received incomplete DEL command.");
    return `ERROR: DEL command must include key.`;
  }

  // Check if the key exists and has been removed
  const isKeyExistAndDeleted = store.delete(key);

  // Handle non-exist key
  if (!isKeyExistAndDeleted) {
    // Return an error if the key does not exist
    console.error(`Key "${key}" not found.`);
    return `ERROR: Key "${key}" not found.`;
  } else {
    // Log the DEL operation
    console.log(`Done: DEL Key=${key}`);

    // Forward the DEL request to other nodes
    forwardRequest("DEL", key, "", nodes, forwarded);

    return `Success: Value DELETED for Key "${key}".`;
  }
}
