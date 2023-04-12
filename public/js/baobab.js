var socket = io();
var lastSelected = document.getElementById("button_white");
let newDiv;
let currentDiv;

function border(obj) {
  ancien = lastSelected;
  couleur = ancien.style.backgroundColor;
  ancien.style.borderColor = couleur;
  obj.style.borderColor = "black";

  lastSelected = obj;
}

// créer tous les blocs
for (let pas = 0; pas < 10; pas++) {
  newDiv = document.createElement("div");

  for (let pas2 = 0; pas2 < 10; pas2++) {
    let btn = document.createElement("button");
    btn.id = "button_" + pas + "_" + pas2;
    btn.classList.add("button_white");
    btn.addEventListener("click", function () {
      border(this);
    });

    newDiv.appendChild(btn);
  }

  document.body.appendChild(newDiv);
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

// changer la valeur d'un cookie
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function hoho(obet) {
  // obetenir l'attribut classe de l'objet, récupérer sa couleur dans le css, et l'envoyer en socket pour modifier la case
  test = document.getElementById(obet).getAttribute("class");
  element = document.querySelector("." + test);
  style = getComputedStyle(element).backgroundColor;

  socket.emit("checkedTrue", style);
}

// quand on nous demande de changer la couleur d'une case
socket.on("change", (couleur, idCarreAChanger) => {
  element = document.querySelectorAll(".button_white");

  // changer la couleur du carré blanc

  element.forEach((userItem) => {
    userItem.style.backgroundColor = couleur;
    userItem.style.borderColor = couleur;
  });
});
