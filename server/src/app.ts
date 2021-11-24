import { Server } from "socket.io";
import { v4 as uuid } from 'uuid';
import { DataLayer, User } from "./data";
import express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

const io: Server = require('socket.io')(http);
const PORT: number = 3000

const dataLayer = new DataLayer();

dataLayer.init().then(() => {
  app.use(express.json());

  app.get('/', (req: any, res: any) => {
    res.sendFile(path.resolve('client/index.html'));
  });

  app.get('/uuid', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "uuid": uuid() }));
  });

  // user creation
  app.post('/users', (req: any, res: any) => {
    let newId = uuid();    
    let newUser: User = new User(newId, req.body.name);
    console.log(newUser);
    dataLayer.addUser(newUser);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newUser));
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

}).catch((err) => {
  console.error(err);
});