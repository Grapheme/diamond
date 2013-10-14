$(window).on("load", function() {
	var socket = io.connect("./");

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
