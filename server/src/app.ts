import { Server } from "socket.io";

const PORT:number = 3000

const io:Server = new Server({ /* options */ });

io.on("connection", (socket) => {
  // ...
  console.log(`connected at port ${PORT}`);
});

console.log(`start listening at port ${PORT}...`);
io.listen(PORT);