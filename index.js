const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const dir = path.resolve(__dirname);
// Pour modifier la taille de la zone de jeu
const nbCol = 15; 
const nbLig = 10; 

var tab=[]
// Tableau stockage couleur initialisé en blanc
for (let i = 0; i < nbLig; i++) {
  tab[i] = [];
  for (let j = 0; j < nbCol; j++) {
    tab[i][j] = 'white';
  }
}
process.setMaxListeners(0); //askip c'est pas bien mais osef

// inclure le dossier public !! pour tout ce qui est static (css, image) NOTE : il y a pas le '/' à la fin de public, il faut donc le mettre au début de tous les liens (ex : href="/css/styleBaobab.css")
app.use(express.static(dir + "/public"));

// charger les différentes pages
app.get("/", (req, res) => {
  res.sendFile(dir + "/war.html");
});

app.get("/baobab", (req, res) => {
  res.sendFile(dir + "/baobab.html");
});

// socket.io
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("newConnection",nbCol,nbLig,tab);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // war.html         MAJ de l'état d'un pixel
  socket.on("update", (id, color) => {
    let coord = id.split(",")
    tab[coord[0]][coord[1]]=color
    io.emit("G_update", id, color);
  });

  // baobab.html      changer tous les blocs de couleur
  socket.on("checkedTrue", (data, idCarreAChanger) => {
    io.emit("change", data);
  });

  // ---------------------------------------- COOKIE A FAIRE
  socket.emit("manageCookie");

  //! RECUPERER UN MEC RANDOM POUR LE DONNER A UN NOUVEAU ICI
  socket.join("users");
  const clients = io.sockets.adapter.rooms.get("users");
  for (const clientId of clients) {
    //this is the socket of each client in the room.
    const clientSocket = io.sockets.sockets.get(clientId);

    // afficher l'id du client
    console.log(clientSocket.id);
  }
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
