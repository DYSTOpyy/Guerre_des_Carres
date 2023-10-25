const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const dir = path.resolve(__dirname);
let cookieParser = require('cookie-parser');

let users = new Map();    // stockage de users

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

const waiting_players = new Map();

let tab = []            // Tableau stockage couleur initialisé en blanc
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
		const already_used = [...users.values()].some(name => name === username);  // test si pseudo déjà existant
				

		if (!already_used && !users.has(id)) {
			const sanitized_username = username.match(/[\w]+/);
			users.set(id, sanitized_username);
			socket.emit("valide");
		} else {
			socket.emit("already");
		}
	});

	// war.html         MAJ de l'état d'un pixel et stockage dans le tableau cote serveur
	socket.on("update", (id, color, userCookie) => {
		const coord = String(id).split(",");
		const cookie = users.get(userCookie);
		if (cookie != null && color != null && Fcolors.has(color) && coord.length == 2 && coord[0] >= 0 && coord[0] < nbCol && coord[1] >= 0 && coord[1] < nbLig) {
			const current_time = new Date();
			if ((waiting_players.has(cookie) && (current_time.getTime() - waiting_players.get(cookie) > 500) || !waiting_players.has(cookie) )) {
				tab[coord[0]][coord[1]][0] = color;
				tab[coord[0]][coord[1]][1] = cookie;
				tab[coord[0]][coord[1]][2] = current_time;
				waiting_players.set(cookie, current_time.getTime());
				io.emit("G_update", id, color);
			}

		}
	});

	socket.on("show", (id) => {
		const coord = String(id).split(",");
		if (coord.length == 2 && coord[0] >= 0 && coord[0] < nbCol && coord[1] >= 0 && coord[1] < nbLig) {
			const color = tab[coord[0]][coord[1]][0];
			const pseudo = tab[coord[0]][coord[1]][1];
			let diff = null;
			if (tab[coord[0]][coord[1]][2] != null) {
				diff = new Date().getTime() - (tab[coord[0]][coord[1]][2]).getTime();
			}
			const colorF = Fcolors.get(color);
			socket.emit("content", colorF, pseudo, diff);
		};
	});

});

server.listen(80, () => {         // lancement du serveur
	console.log("listening on *:80");
});
