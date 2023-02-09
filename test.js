// importer les trucs

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require("socket.io")(http);
const { dirname } = require('path');

process.setMaxListeners(0);     //askip c'est pas bien mais osef

// inclure le dossier public !! pour tout ce qui est static (css, image) NOTE : il y a pas le '/' à la fin de public, il faut donc le mettre au début de tous les liens (ex : href="/css/style.css")
app.use(express.static(__dirname + '/public'));

// envoyer la page d'accueil lorsque l'on va sur /
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
}
);



// envoyer une autre page lorsque l'on va sur /basic.html
app.get('/basic.html', function(req,res){
  res.sendFile(__dirname + '/basic.html');
});

// lorsque quelqu'un se connecte au socket
io.on("connection", function (socket) {
    console.log("Made socket connection");

    // ROOM POUR LISTER LES USERS

    socket.emit("manageCookie");

    //! RECUPERER UN MEC RANDOM POUR LE DONNER A UN NOUVEAU ICI
    socket.join("users");
    const clients = io.sockets.adapter.rooms.get('users');
    for (const clientId of clients ) {

      //this is the socket of each client in the room.
      const clientSocket = io.sockets.sockets.get(clientId);

      // afficher l'id du client
      console.log(clientSocket.id);
 
    }

    

    // fonction pour changer la couleur au clic sur TOUS les clients actuels
    socket.on("checkedTrue", (data, idCarreAChanger) => {
      io.emit("change", data);

    });

    // lors de la déconnexion
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

  

});

// lancer le serveur en localhost:80 avec la commande "node index.js" (pourquoi j'ai remplacé server.listen par ça ?)
http.listen(80)

