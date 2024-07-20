import * as net from "net";

const port = process.env.PORT || 3000;

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("close", (hadError) => {
    console.log(`Client disconnected${hadError ? " due to an error." : "."}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
