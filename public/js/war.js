var socket = io();
var chosen_color = "white";

var colors = [
  "white",
  "gray",
  "silver",
  "maroon",
  "red",
  "purple",
  "green",
  "lime",
  "olive",
  "yellow",
  "navy",
  "blue",
  "teal",
  "aqua",
  "black",
];

function submit(id, bgcolor) {
  socket.emit("update", id, bgcolor);
}

socket.on("newConnection", () => {
  for (item of document.getElementsByClassName("square")) {
    item.style.backgroundColor = colors[0];
    item.style.borderColor = colors[0];
  }
});

socket.on("G_update", (name, Ncolor) => {
  document.getElementById(name).style.backgroundColor = Ncolor;
  document.getElementById(name).color = Ncolor;
});

function changing(square) {
  submit(square.id, chosen_color);
}

function hoho(obet) {
  // obetenir l'attribut classe de l'objet, récupérer sa couleur dans le css, et l'envoyer en socket pour modifier la case
  test = document.getElementById(obet);
  chosen_color = window.getComputedStyle(test).backgroundColor;
  socket.emit("checkedTrue", chosen_color);
}

// crée les boutons
newDiv = document.createElement("div");
colors.forEach((item, index) => {
  let btn = document.createElement("button");
  btn.id = "button_" + item;
  btn.classList.add("button");
  btn.backgroundColor = item;
  btn.onclick = function () {
    hoho(this.id);
    border(this);
  };
  newDiv.appendChild(btn);
});

document.body.appendChild(newDiv);

// à améliorer, voir maxime
// donne la couleur aux boutons
colors.forEach((item, index) => {
  let str = "button_" + item;
  document.getElementById(str).style.backgroundColor = item;
});

// bordure
var lastSelected = document.getElementById("button_white");
function border(obj) {
  ancien = lastSelected;
  ancien.style.borderColor = "white";
  obj.style.borderColor = "black";
  lastSelected = obj;
}

// créer les pixels
for (let pas = 0; pas < 10; pas++) {
  newDiv = document.createElement("div");
  newDiv.classList.add("row");

  for (let pas2 = 0; pas2 < 10; pas2++) {
    let carre = document.createElement("div");
    carre.id = pas + "," + pas2;
    carre.classList.add("square");
    carre.onclick = function () {
      changing(this);
    };
    // let overlay = document.createElement("div");
    // overlay.classList.add('overlay');
    // overlay.onmouseover = function () {showing(this.parentElement,this)};
    // carre.appendChild(overlay);
    newDiv.appendChild(carre);
  }

  document.body.appendChild(newDiv);
}

function showing(parent, element) {
  texttoshow = parent.style.backgroundColor;
  element.innerHTML = texttoshow;
}
