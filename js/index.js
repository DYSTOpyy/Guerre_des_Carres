const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path =require('path');

const dir=path.resolve(__dirname,'..');
process.setMaxListeners(0);     //askip c'est pas bien mais osef

// inclure le dossier public !! pour tout ce qui est static (css, image) NOTE : il y a pas le '/' à la fin de public, il faut donc le mettre au début de tous les liens (ex : href="/css/style.css")
app.use(express.static(dir + '/public'));

// envoyer la page d'accueil lorsque l'on va sur /
app.get('/', (req, res) => {
    res.sendFile(dir + '/war.html');
  });

app.get('/baobab', (req, res) => {
    res.sendFile(dir + '/baobab.html');
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