import * as net from "net";

export function forwardRequest(
  command: string,
  key: string,
  value: string,
  nodes: string[],
  forwarded: string
) {
  // check if the request is already forwarded
  if (forwarded) return;

  // Iterate over each node to create socket connection then write the command
  // Each node acting as a server
  nodes.forEach((node: any) => {
    // Node format is "host:port"
    const [host, port] = node.split(":");

    // Create a new socket connection to the node
    const client = new net.Socket();
    client.connect(Number(port), host, () => {
      console.log(`Connected to server on port ${port}`);
      // Send the command to the node
      client.write(`${command} ${key} ${value} forwarded`);
    });

    // Handle data received from the node
    client.on("data", (data) => {
      // Log the response from the node
      console.log(`Response from ${node}: ${data.toString()}`);

      client.destroy();
    });

    client.on("error", (err) => {
      console.error(`Error with ${node}: ${err.message}`);
    });
  });
}