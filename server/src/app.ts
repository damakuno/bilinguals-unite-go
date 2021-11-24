import { Server } from "socket.io";
import { v4 as uuid } from 'uuid';
import { DataLayer, User, Game } from "./data";
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
    dataLayer.addUser(newUser);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newUser));
  });

  app.get('/users/:uid', (req: any, res: any) => {
    let uid = req.params.uid;
    dataLayer.getUser(uid).then(user => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    });
  });

  app.post('/games', (req: any, res: any) => {
    let newId = uuid();
    let user = req.body.user;
    let settings = req.body.settings;
    dataLayer.getUser(user.id).then(user => {
      let newGame = new Game(newId, settings, user);
      console.log(newGame);
      dataLayer.addGame(newGame);
    });
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