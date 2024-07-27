import * as net from "net";
import { delKey, getKey, setKey } from "../services/storeService";
import Node from "../types/node";

let clientMessage: string;

export function handleRequest(socket: net.Socket, data: Buffer, nodes: Node[]) {
  // Convert incoming data(Buffer) to a string and trim any extra whitespace
  const request = data.toString().trim();

  if (request === "HEARTBEAT") {
    socket.write("ALIVE");
    return;
  }

  // Request formmat is COM key value >> SET someKey someValue
  const [command = "", key = "", value = "", forwarded = ""] =
    request.split(" ");

  // Validate the request command
  const validCommand: boolean =
    command === "GET" || command === "SET" || command === "DEL";

  // Handle invalid or empty commands
  if (!command || !validCommand) {
    console.error("Received an empty or invalid command.");
    clientMessage = "ERROR: Invalid or empty command.";
    socket.write(clientMessage);
    return;
  }

  // Handle SET command
  if (command === "SET") {
    clientMessage = setKey(key, value, forwarded, nodes);
    socket.write(clientMessage);
  }
  //Handle GET command
  else if (command === "GET") {
    clientMessage = getKey(key);
    socket.write(clientMessage);
  }
  //Handle DEL command
  else if (command === "DEL") {
    clientMessage = delKey(key, forwarded, nodes);
    socket.write(clientMessage);
  }
}
