var socket = io();
var chosen_color = 'black';
var mode;
var lastSelected;
var wait = false;

var colors = [
	'red', 'orange',
	'yellow', 'lime',
	'green', 'teal',
	'cyan', 'blue',
	'purple', 'magenta',
	'violet', 'brown',
	'black', 'gray',
	'lightgray', 'white'
];

socket.on("newConnection", (nbCol, nbLig, tab) => { // Apparition nouveau joueur et recuperation infos 
	creation(nbCol, nbLig);
	for (let lig = 0; lig < nbLig; lig++) {
		for (let col = 0; col < nbCol; col++) {
			document.getElementById(lig + ',' + col).style.backgroundColor = tab[lig][col][0];
		}
	}
});

function creation(nbCol, nbLig) {             // créer les pixels
	mode = "player";
	main = document.createElement("div");
	main.id = "main";
	play = document.createElement("div");
	play.classList.add("playground");
	for (let lig = 0; lig < nbLig; lig++) {
		newDiv = document.createElement("div");
		newDiv.classList.add("row");
		for (let col = 0; col < nbCol; col++) {
			let carre = document.createElement("div");
			carre.id = lig + ',' + col;
			carre.classList.add("square");
			carre.addEventListener("click", function () {
				clicking(this);
			});
			newDiv.appendChild(carre);
		}
		play.appendChild(newDiv);
	}
	main.appendChild(play);
	document.getElementById("content").appendChild(main);
	sidebar = document.createElement("div");
	sidebar.id = "sidebar";
	document.getElementById("content").appendChild(sidebar);
	toggle();
	buttons();
	colors.forEach((item) => { // donne la couleur aux boutons
		document.getElementById("button_" + item).style.backgroundColor = item;
	});
	info();
	lastSelected = document.getElementById("button_" + chosen_color);       // bordure
	lastSelected.style.borderColor = 'black';
}

socket.on("G_update", (name, Ncolor) => { // Changement de la couleur coté client
	document.getElementById(name).style.backgroundColor = Ncolor;
});

socket.on("wait", () => {
	wait = false;
})

function clicking(square) {         // action lorque que le joueur clique sur une case selon son mode
	if (mode === "player") {
		if (!wait) {
			socket.emit("update", square.id, chosen_color, getCookie("id"));
			wait = true;
		}
		else {
			alert("Veuillez attendre un peu avant de poser un nouveau carré !")
		}

	}
	else {
		socket.emit("show", square.id);
	}
}

function setColor(objet) {   // obtenir l'attribut classe de l'objet, récupérer sa couleur dans le css, et l'envoyer en socket pour modifier la case
	chosen_color = objet.style.backgroundColor;
}

function buttons() {
	newDiv = document.createElement("div");         // créer les boutons
	newDiv.id = "btn_div";
	colors.forEach((item, index) => {
		btn = document.createElement("button");
		btn.id = "button_" + item;
		btn.classList.add("button");
		btn.style.backgroundColor = item;
		btn.addEventListener("click", function () {
			setColor(this);
			setBorder(this);
		});
		newDiv.appendChild(btn);
	});
	document.getElementById("sidebar").appendChild(newDiv);
}

function setBorder(obj) {
	var ancien = lastSelected;
	ancien.style.borderColor = 'white';
	obj.style.borderColor = 'black';
	lastSelected = obj;
}

function toggle() {
	newDiv = document.createElement("div");
	newDiv.id = "toggle"
	newDiv.appendChild(addTarget());
	newDiv.appendChild(addEye());
	document.getElementById("sidebar").appendChild(newDiv);
}

function addTarget() {
	cible = document.createElement("lord-icon");
	cible.src = "https://cdn.lordicon.com/iltqorsz.json";
	cible.trigger = "hover";
	cible.colors = "primary:#000000,secondary:#f57425";
	cible.stroke = "90";
	cible.state = "hover-2";
	cible.style = "width:70px;height:70px";
	cible.addEventListener("click", function () {
		document.getElementById("info").style.opacity = 0.1;
		document.getElementById("info").innerHTML = "";
		for (item of document.getElementsByClassName("button")) {
			item.style.opacity = 1;
		}
		mode = "player";
	})
	return cible;
}

function addEye() {
	eye = document.createElement("lord-icon");
	eye.src = "https://cdn.lordicon.com/tyounuzx.json";
	eye.trigger = "hover";
	eye.colors = "primary:#121331,secondary:#f57425";
	eye.stroke = "90";
	eye.style = "width:70px;height:70px";
	eye.addEventListener("click", function () {
		for (item of document.getElementsByClassName("button")) {
			item.style.opacity = 0.1;
		}
		document.getElementById("info").style.opacity = 1;
		mode = "viewer";
	})
	return eye;
}

function info() {
	newDiv = document.createElement("div");
	newDiv.id = "info";
	para = document.createElement("p")
	para.innerHTML = "";
	newDiv.appendChild(para);
	document.getElementById("sidebar").appendChild(newDiv);
}

socket.on("content", (color, pseudo, date) => {  // affichage couleur + pseudo
	var texttoshow;
	if (date != null && pseudo != null) {
		texttoshow = "Ce pixel " + color + " a été coloré par <br><strong>" + pseudo + "</strong><br>il y a " + toText(date) + ".";
	}
	else {
		texttoshow = "Personne n'a coloré ce pixel blanc."
	}
	document.getElementById("info").innerHTML = texttoshow;
});

function toText(date) {
	date = (date - date % 1000) / 1000;
	var output;
	if (date == 1) {
		output = date + " seconde";
	} else {
		if (date < 60) {
			output = date + " secondes";
		} else {
			date = (date - date % 60) / 60;
			if (date == 1) {
				output = date + " minute";
			} else {
				if (date < 60) {
					output = date + " minutes";
				} else {
					date = (date - date % 60) / 60;
					output = date + " heures";
				}
			}
		}
	}
	return output;
}

function getCookie(cname) { // obtenir la valeur d'un cookie
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
