$(window).on("load", function() {
	var socketAddress = location.origin + location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);

	var socket = io.connect(socketAddress);

	var demo = Sketch.create({
		container: document.getElementById( 'container' )
	});



	demo.mousemove = function() {
		var touch = demo.touches[0];

		socket.emit("move", {
			x : touch.x / demo.width, 
			y : touch.y / demo.height
		});
	}
});
