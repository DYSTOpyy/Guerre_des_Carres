var socket = io();
var chosen_color = "white";
var username;
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

socket.emit("whoami", getCookie("id"));     // récupérer l'username associé au cookie et l'afficher
socket.on("iam", (name) => {
  var username = name;
});

socket.on("newConnection", (nbCol,nbLig,tab) => { // Apparition nouveau joueur et recuperation infos 
  creation(nbCol,nbLig);
  for (let lig = 0; lig<nbLig;lig++){
    for (let col = 0;col<nbCol;col++){
      document.getElementById(lig+','+col).style.backgroundColor = tab[lig][col][0];
    }
  }
});

document.getElementById("change").addEventListener("click",changeMode)

socket.on("G_update", (name, Ncolor) => { // Changement de la couleur coté client
  document.getElementById(name).style.backgroundColor = Ncolor;
});

function clicking(square) {         // action lorque que le joueur clique sur une case selon son mode
  if (mode === "player"){
    socket.emit("update", square.id, chosen_color,getCookie("id"));
  }
  else{
    socket.emit("show", square.id);
  }
}

function hoho(obet) {   // obtenir l'attribut classe de l'objet, récupérer sa couleur dans le css, et l'envoyer en socket pour modifier la case

  test = document.getElementById(obet);
  chosen_color = test.style.backgroundColor;
  socket.emit("checkedTrue", chosen_color);
}

newDiv = document.createElement("div");         // créer les boutons
newDiv.classList.add("btn_div")
colors.forEach((item, index) => {
  let btn = document.createElement("button");
  btn.id = "button_" + item;
  btn.classList.add("button");
  btn.style.backgroundColor = item;
  btn.addEventListener("click", function () {
    hoho(this.id);
    border(this);
  });
  newDiv.appendChild(btn);
});
document.body.appendChild(newDiv);


colors.forEach((item) => { // donne la couleur aux boutons
  let str = "button_" + item;
  document.getElementById(str).style.backgroundColor = item;
});

var lastSelected = document.getElementById("button_"+chosen_color);       // bordure
lastSelected.style.borderColor ="black";
function border(obj) {
  ancien = lastSelected;
  ancien.style.borderColor = "white";
  obj.style.borderColor = "black";
  lastSelected = obj;
}

function creation(nbCol,nbLig){             // créer les pixels
  play = document.createElement("div");
  play.classList.add("playground");
    for (let lig = 0; lig < nbLig; lig++) {
      newDiv = document.createElement("div");
      newDiv.classList.add("row");
      for (let col = 0; col < nbCol; col++) {
        let carre = document.createElement("div");
        carre.id =  lig+','+col;
        carre.classList.add("square");
        carre.addEventListener("click",function () {
          clicking(this);
        });
        newDiv.appendChild(carre);
      }
      play.appendChild(newDiv);
    }
  document.body.appendChild(play);
}


function changeMode(){  // Choix mode viewer / joueur
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

changeMode(); // Pour set le mode player initial

socket.on("content", (color,pseudo,date) => {  // affichage couleur + pseudo
  if (pseudo==null){
    pseudo = "default"
  }
  texttoshow ="Ce pixel "+ color +" a été dessiné par "+pseudo;
  if (date!=null){
    texttoshow += " le "+date;
  }
  document.getElementById("info").innerHTML = texttoshow;
});
function showing(element) {
  texttoshow = element.style.backgroundColor;
  document.getElementById("info").innerHTML = texttoshow;
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
