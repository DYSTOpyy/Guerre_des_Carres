var socket = io();
var chosen_color = "olive";
var mode ;

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

// action lorque que le joueur clique sur une case
function clicking(square) {
  if (mode === "player"){
    submit(square.id, chosen_color);
  }
  else{
    showing(square);
  }
}

function hoho(obet) {
  // obetenir l'attribut classe de l'objet, récupérer sa couleur dans le css, et l'envoyer en socket pour modifier la case
  test = document.getElementById(obet);
  chosen_color = test.style.backgroundColor;
  socket.emit("checkedTrue", chosen_color);
}

// crée les boutons
newDiv = document.createElement("div");
colors.forEach((item, index) => {
  let btn = document.createElement("button");
  btn.id = "button_" + item;
  btn.classList.add("button");
  btn.style.backgroundColor = item;
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
var lastSelected = document.getElementById("button_"+chosen_color);
lastSelected.style.borderColor ="black";
function border(obj) {
  ancien = lastSelected;
  ancien.style.borderColor = "white";
  obj.style.borderColor = "black";
  lastSelected = obj;
}

// créer les pixels
play = document.createElement("div");
play.classList.add("playground");
  for (let pas = 0; pas < 13; pas++) {
    newDiv = document.createElement("div");
    newDiv.classList.add("row");
    for (let pas2 = 0; pas2 < 20; pas2++) {
      let carre = document.createElement("div");
      carre.id = pas + "," + pas2;
      carre.classList.add("square");
      carre.onclick = function () {
        clicking(this);
      };
      newDiv.appendChild(carre);
    }
    play.appendChild(newDiv);
  }
document.body.appendChild(play);

function changeMode(){
  if (mode === "player"){
    mode = "viewer";
    for (item of document.getElementsByClassName("button")) {
      item.style.display ="none";
    }
    document.getElementById("info").style.display="block"
  }
  else{
    mode = "player";
    document.getElementById("info").style.display="none"
    for (item of document.getElementsByClassName("button")) {
      item.style.display ="inline-block";
    }
  }
  document.getElementById("change").innerHTML=mode;
}

changeMode();

function showing(element) {
  texttoshow = element.style.backgroundColor;
  document.getElementById("info").innerHTML = texttoshow;
}
