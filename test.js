// importer les trucs

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require("socket.io")(http);
const { dirname } = require('path');

//  appeler le dossier publique
app.use(express.static("public"));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
}
);

app.get('/basic.html', function(req,res){
  res.sendFile(__dirname + '/basic.html');
}
);

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("checkedTrue", (data) => {
      socket.emit("change", "basic.html", data);
      // io.emit("change", ("test", data));



  });

});

http.listen(80)

