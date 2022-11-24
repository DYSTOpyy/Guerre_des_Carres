const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cookie: true
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/js/client.js', (req, res) => {
    res.sendFile(__dirname + '/js/client.js');
  });

  
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });

    socket.on('clique', () => {
        console.log('il a cliqué !');
      });
    
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});