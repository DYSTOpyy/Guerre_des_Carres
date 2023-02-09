const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/war.html');
  });

  
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('newConnection');
    socket.on('disconnect', () => {
    	console.log('user disconnected');
    	});
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    socket.on('update',(id,color) =>{
      console.log('Le carre '+ id+ ' est '+color);
      console.log('Requete envoye');
      io.emit('G_update',id,color);
    
	})
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});