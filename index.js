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

const Fcolors = new Map([
	["white", "blanc"],
	["gray", "gris"],
	["lightgray", "gris clair"],
	["brown", "marron"],
	["red", "rouge"],
	["purple", "violet"],
	["green", "vert"],
	["lime", "vert clair"],
	["yellow", "jaune"],
	["teal", "bleu canard"],
	["blue", "bleu"],
	["violet", "rose"],
	["cyan", "cyan"],
	["black", "noir"],
	["orange", "orange"],
	["magenta", "magenta"]])
// Pour modifier la taille de la zone de jeu
const nbCol = 30;
const nbLig = 30;

const waiting_players = new Array();

var tab = []            // Tableau stockage couleur initialisé en blanc
for (let i = 0; i < nbLig; i++) {
	tab[i] = [];
	for (let j = 0; j < nbCol; j++) {
		tab[i][j] = ["white", null, null];
	}
}

app.use(cookieParser());
app.use(express.static(dir + "/public"));     // inclure le dossier public !! pour tout ce qui est static (css, image) NOTE : il y a pas le '/' à la fin de public, il faut donc le mettre au début de tous les liens (ex : href="/css/styleBaobab.css")


app.get("/", (req, res) => {      // page de jeu 
	// si il y a pas de cookie
	if (req.cookies["id"] == undefined || users.get(req.cookies["id"]) == undefined) {        // si il y a pas de cookie OU que le cookie n'a pas d'username associé
		res.redirect("/login");

	} else { // sinon si il en a un
		res.sendFile(dir + "/war.html");
	}
});


app.get("/login", (req, res) => {     // page de login
	if (req.cookies["id"] == undefined || users.get(req.cookies["id"]) == undefined) {        // si il y a pas de cookie OU que le cookie n'a pas d'username associé
		res.sendFile(dir + "/login.html");
	} else {      // sinon si il en a un
		res.redirect("/");
	}

});

io.on("connection", (socket) => {     // socket.io
	socket.emit("newConnection", nbCol, nbLig, tab);

	socket.on("newUser", (username, id) => {
		let valide = true;        // test si pseudo déjà existant
		username = String(username).match(/[\w]+/);
		for (let name of users.values()) {
			if (name === username) { valide = false; }
		}

		if (valide && !users.has(id)) {
			users.set(id, username);
			socket.emit("valide");
		} else {
			socket.emit("already");
		}
	});

	// war.html         MAJ de l'état d'un pixel et stockage dans le tableau cote serveur
	socket.on("update", (id, color, userCookie) => {
		let coord = String(id).split(",");
		let cookie = users.get(userCookie);
		if (cookie != null && color != null && Fcolors.has(color) && coord.length == 2 && coord[0] >= 0 && coord[0] < nbCol && coord[1] >= 0 && coord[1] < nbLig && !waiting_players.includes(cookie)) {
			tab[coord[0]][coord[1]][0] = color;
			tab[coord[0]][coord[1]][1] = cookie;
			tab[coord[0]][coord[1]][2] = new Date();
			waiting_players.push(cookie);
			io.emit("G_update", id, color);
			setTimeout(() => {
				const index = waiting_players.indexOf(cookie);
				if (index > -1) {
					waiting_players.splice(index, 1);
				}
			}, 500);
		}
	});

	socket.on("show", (id) => {
		let coord = String(id).split(",");
		if (coord.length == 2 && coord[0] >= 0 && coord[0] < nbCol && coord[1] >= 0 && coord[1] < nbLig) {
			var color = tab[coord[0]][coord[1]][0];
			var pseudo = tab[coord[0]][coord[1]][1];
			var actDate = new Date();
			var diff = null;
			if (tab[coord[0]][coord[1]][2] != null) {
				diff = actDate.getTime() - (tab[coord[0]][coord[1]][2]).getTime();
			}
			var colorF = Fcolors.get(color);
			socket.emit("content", colorF, pseudo, diff);
		};
	});

});

server.listen(80, () => {         // lancement du serveur
	console.log("listening on *:80");
});
