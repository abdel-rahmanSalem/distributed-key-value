import { createServer } from "./server";
import { loadConfig } from "./utils/utils";

// Load configuration file specified as a command-line argument
const configFileName = process.argv[2];
const config = loadConfig(configFileName);

// Start the server with the loaded configuration
createServer(config.port, config.nodes);
console.log("Distributed key-value store server started.");
