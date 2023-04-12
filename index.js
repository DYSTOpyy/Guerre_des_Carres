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

const Fcolors = new Map(["white","blanche"],
["gray","grise"],
["silver","argentée"],
["maroon","marron"],
["red"],["purple"],
["green"],
["lime"],
["olive"],
["yellow"],
["navy"],
["blue"],[
"teal"],[
"aqua"],[
"black"],[
"orange"],[
"pink"])
// Pour modifier la taille de la zone de jeu
const nbCol = 30; 
const nbLig = 30; 

const  mois = ['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'];

var tab=[]            // Tableau stockage couleur initialisé en blanc
for (let i = 0; i < nbLig; i++) {       
  tab[i] = [];
  for (let j = 0; j < nbCol; j++) {
    tab[i][j] = ['white',null,null];
  }
}

app.use(cookieParser());
app.use(express.static(dir + "/public"));     // inclure le dossier public !! pour tout ce qui est static (css, image) NOTE : il y a pas le '/' à la fin de public, il faut donc le mettre au début de tous les liens (ex : href="/css/styleBaobab.css")


app.get("/", (req, res) => {      // page de jeu 
  
  // si il y a pas de cookie
  
  if (req.cookies["id"] == undefined || users.get(req.cookies["id"])  == undefined) {        // si il y a pas de cookie OU que le cookie n'a pas d'username associé
      res.redirect("/login");
  
  } else { // sinon si il en a un
    res.sendFile(dir + "/war.html");
  }
});


app.get("/baobab", (req, res) => {      // page de test
  res.sendFile(dir + "/baobab.html");
});

app.get("/login", (req, res) => {     // page de login
  if (req.cookies["id"] == undefined || users.get(req.cookies["id"])  == undefined) {        // si il y a pas de cookie OU que le cookie n'a pas d'username associé
    res.sendFile(dir + "/login.html");
  } else {      // sinon si il en a un
    res.redirect("/");
  }
  
});

io.on("connection", (socket) => {     // socket.io
  // console.log("a user connected");
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

  socket.on("whoami", (userCookie) => {     // envoie au client son pseudo
    socket.emit("iam", (users[userCookie]));
  });

  socket.on("disconnect", () => {         // on deconnexion
    console.log("user disconnected");
  });

  // war.html         MAJ de l'état d'un pixel
  socket.on("update", (id, color,userCookie) => {
    let coord = id.split(",");
    tab[coord[0]][coord[1]][0]=color;
    tab[coord[0]][coord[1]][1]=users.get(userCookie);
    var time=new Date()
    tab[coord[0]][coord[1]][2]= time.getDate()+" "+mois[time.getMonth()]+" "+time.getFullYear()+" a "+time.getHours()+"h"+time.getMinutes();
    io.emit("G_update", id, color);
  });

  socket.on("show",(id)=>{
    let coord = id.split(",")
    color=tab[coord[0]][coord[1]][0]
    pseudo=tab[coord[0]][coord[1]][1]
    date=tab[coord[0]][coord[1]][2]
    socket.emit("content",color,pseudo,date)
  })

  // baobab.html      changer tous les blocs de couleur
  socket.on("checkedTrue", (data, idCarreAChanger) => {
    io.emit("change", data);
  });

});

server.listen(80, () => {         // lancement du serveur
  console.log("listening on *:80");
});
