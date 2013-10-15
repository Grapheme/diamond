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

app.get("/", function(req, res) {
	var parser = new uaparser();
	var ua = req.headers['user-agent'];   
	var result = parser.setUA(ua).getResult();

	if(result.device.type) {
		return res.sendfile(__dirname + "/public/mover.html");
	} 

	return res.sendfile(__dirname + "/public/index.html");
});


io.sockets.on("connection", function(socket) {
  socket.on("move", function(data) {
    socket.broadcast.emit("actuate", data);
  });
});
