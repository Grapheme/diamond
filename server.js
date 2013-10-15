var express   = require("express");
var uaparser  = require("ua-parser-js");
var socketio  = require("socket.io");
var http	  = require("http");
    
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


var port = 4000;

app.use(app.router);
app.use(express.static(__dirname + "/public"));


server.listen(port);

var parser = new uaparser();

app.get("/", function(req, res) {
	var ua = req.headers['user-agent'];   
	var result = parser.setUA(ua).getResult();

	if(result.device.type) {
		res.sendfile(__dirname + "/public/mover.html");
	} else {
		res.sendfile(__dirname + "/public/index.html");
	}
});


io.sockets.on("connection", function(socket) {
  socket.on("move", function(data) {
    socket.broadcast.emit("actuate", data);
  });
});
