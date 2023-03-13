var socket = io();
var chosen_color = "white";
var username;
let output = document.querySelector(".output");
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
  "orange",
  "pink"
];

// récupérer l'username associé au cookie et l'afficher
socket.emit("whoami", getCookie("id"));
socket.on("iam", (name) => {
  var username = name;
  output.innerHTML = "Your username is:" + username;
});

function submit(id, bgcolor) {
  socket.emit("update", id, bgcolor);
}

// Apparition nouveau joueur et recuperation infos 
socket.on("newConnection", (nbCol,nbLig,tab) => {
  creation(nbCol,nbLig);
  for (let lig = 0; lig<nbLig;lig++){
    for (let col = 0;col<nbCol;col++){
      document.getElementById(lig+','+col).style.backgroundColor = tab[lig][col];
    }
  }
});

socket.on("G_update", (name, Ncolor) => {
  document.getElementById(name).style.backgroundColor = Ncolor;
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
newDiv.classList.add("btn_div")
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
function creation(nbCol,nbLig){
  play = document.createElement("div");
  play.classList.add("playground");
    for (let lig = 0; lig < nbLig; lig++) {
      newDiv = document.createElement("div");
      newDiv.classList.add("row");
      for (let col = 0; col < nbCol; col++) {
        let carre = document.createElement("div");
        carre.id =  lig+','+col;
        carre.classList.add("square");
        carre.onclick = function () {
          clicking(this);
        };
        newDiv.appendChild(carre);
      }
      play.appendChild(newDiv);
    }
  document.body.appendChild(play);
}

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

// obtenir la valeur d'un cookie
function getCookie(cname) {
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

// obtenir la valeur d'un cookie
function getCookie(cname) {
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
