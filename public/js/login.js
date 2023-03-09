var socket = io();


    document.forms["login-form"].addEventListener("submit", catchData);
    function catchData(e){
        e.preventDefault();
        let error = document.querySelector(".error");
        let output = document.querySelector(".output");
        
        let username = this.username.value;
 
        if(username === ""){
            error.innerHTML = "Wrong username";
            output.innerHTML = "";
        }else{
            error.innerHTML = "";
            document.cookie = "id="+socket.id+"; expires=Thu, 18 Dec 2023 12:00:00 UTC";
            socket.emit("newUser", username, socket.id);
            window.location.href = '/';
        }
    }