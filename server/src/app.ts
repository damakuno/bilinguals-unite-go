import { Server } from "socket.io";
import { uuid } from 'uuidv4';
import express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

const io: Server = require('socket.io')(http);
const PORT: number = 3000

app.get('/', (req: any, res: any) => {
  res.sendFile(path.resolve('client/index.html'));
});

app.get('/uuid', (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({"uuid": uuid()}));
});

app.use(express.static(path.resolve('client/public')))

//Whenever someone connects this gets executed
io.on('connection', (socket) => {
  console.log(`A user connected with id: ${socket.id}`);
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', () => {
    console.log(`A user disconnected with id: ${socket.id}`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});