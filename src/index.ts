import { createServer } from "./server/server";
import { getConfigName, loadConfig } from "../src/config";

// Load configuration file specified as a command-line argument path[3]
try {
  const configFileName = getConfigName();
  const config = loadConfig(configFileName);

  // Start the server with the loaded configuration
  createServer(config.port, config.nodes);
  console.log("Distributed key-value store server started.");
} catch (err: any) {
  console.error("Error loading configuration:", err.message);
}
