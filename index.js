const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const dir = path.resolve(__dirname);
var cookieParser = require('cookie-parser');

var users = new Map();    // stockage de users

// Pour modifier la taille de la zone de jeu
const nbCol = 30; 
const nbLig = 30; 

var tab=[]
// Tableau stockage couleur initialisé en blanc
for (let i = 0; i < nbLig; i++) {
  tab[i] = [];
  for (let j = 0; j < nbCol; j++) {
    tab[i][j] = ['white',null];
  }
}
process.setMaxListeners(0); //askip c'est pas bien mais osef
app.use(cookieParser());

app.use(express.static(dir + "/public"));     // inclure le dossier public !! pour tout ce qui est static (css, image) NOTE : il y a pas le '/' à la fin de public, il faut donc le mettre au début de tous les liens (ex : href="/css/styleBaobab.css")

// inclure le dossier public !! pour tout ce qui est static (css, image) NOTE : il y a pas le '/' à la fin de public, il faut donc le mettre au début de tous les liens (ex : href="/css/styleBaobab.css")
app.use(express.static(dir + "/public"));

// charger les différentes pages
app.get("/", (req, res) => {
  
  // si il y a pas de cookie
  console.log(req.cookies["id"]);
  if (req.cookies["id"] == undefined || users.get(req.cookies["id"])  == undefined) {        // si il y a pas de cookie OU que le cookie n'a pas d'username associé
      res.redirect("/login");
  
  } else { // sinon si il en a un
    res.sendFile(dir + "/war.html");
  }
});

app.get("/baobab", (req, res) => {
  res.sendFile(dir + "/baobab.html");
});

app.get("/login", (req, res) => {     // page de login
  if (req.cookies["id"] == undefined || users.get(req.cookies["id"])  == undefined) {        // si il y a pas de cookie OU que le cookie n'a pas d'username associé
    res.sendFile(dir + "/login.html");
  // sinon si il en a un
  } else {
    res.redirect("/");
  }
  
});

// socket.io
io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(users);
  socket.emit("newConnection",nbCol,nbLig,tab);

  socket.on("newUser", (username, id) => {
    let valide = true;        // test si pseudo déjà existant
    for (let name of users.values()) {
      if (name == username) {valide = false;}
    }
 
    if (valide) {
      users.set(id, username);
      socket.emit("valide");
    } else {
      socket.emit("already");
    }
    
  });

  // envoie au client son pseudo
  socket.on("whoami", (userCookie) => {

    socket.emit("iam", (users[userCookie]));

  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // war.html         MAJ de l'état d'un pixel
  socket.on("update", (id, color,userCookie) => {
    let coord = id.split(",")
    tab[coord[0]][coord[1]][0]=color
    tab[coord[0]][coord[1]][1]=users.get(userCookie)
    io.emit("G_update", id, color);
  });

  socket.on("show",(id)=>{
    let coord = id.split(",")
    color=tab[coord[0]][coord[1]][0]
    pseudo=tab[coord[0]][coord[1]][1]
    socket.emit("content",color,pseudo)
  })

  // baobab.html      changer tous les blocs de couleur
  socket.on("checkedTrue", (data, idCarreAChanger) => {
    io.emit("change", data);
  });

});

server.listen(80, () => {
  console.log("listening on *:80");
});