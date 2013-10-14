var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var port = 4000;

app.use(express.static(__dirname + "/public"));

server.listen(port);

app.get("/m", function(req, res) {
	res.sendfile(__dirname + "/public/mover.html");
})


io.sockets.on("connection", function(socket) {
  socket.on("move", function(data) {
    socket.broadcast.emit("actuate", data);
  });
});
