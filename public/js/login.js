var socket = io();
var cookieTime = "86400";               // durée d'un cookie en seconde
 
document.forms["login-form"].addEventListener("submit", catchData);
function catchData(e){
    e.preventDefault();
    let error = document.querySelector(".error");
    let username = this.username.value;
 
    if(username === ""){
        error.innerHTML = "T'a pas rentré de pseudo tu crois on t'a pas vu fdp ?";
        output.innerHTML = "";
    }else{
 
        document.cookie = "id="+socket.id+"; max-age="+cookieTime;
        socket.emit("newUser", username, socket.id);            // test si nouvel user est validé
        
    }
}
 
socket.on("valide", () => {             // si le pseudo est validé
    window.location.href = '/';
})

socket.on("already", () => {            // si le pseudo est déjà utilisé
    let error = document.querySelector(".error");
    error.innerHTML = "Ce pseudo est déjà sélectionné, veuillez en choisir un autre.";
});