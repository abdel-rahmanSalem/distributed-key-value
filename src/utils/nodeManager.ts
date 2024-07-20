import * as net from "net";

export function forwardRequest(
  command: string,
  key: string,
  value: string,
  nodes: string[]
) {
  // Iterate over each node to create socket connection then write the command
  // Each node acting as a server
  nodes.forEach((node: any) => {
    // Node format is "host:port"
    const [host, port] = node.split(":");

    // Create a new socket connection to the node
    const client = new net.Socket();
    client.connect(Number(port), host, () => {
      // Send the command to the node
      client.write(`${command} ${key} ${value}`);
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
