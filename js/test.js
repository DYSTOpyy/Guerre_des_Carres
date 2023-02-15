// importer les trucs

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require("socket.io")(http);
const { dirname } = require('path');

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

