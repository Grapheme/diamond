$(window).on("load", function() {
	var part =  location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
	if(part[0] === '/') {
		part = part.substring(1);
	}

	var socket = io.connect(location.origin, {
		resource : part + "socket.io"
	});

	var demo = Sketch.create({
		container: document.getElementById( 'container' )
	});



	var mouseHandler = function() {
		for(var i = 0; i < demo.touches.length; ++i) {
			var touch = demo.touches[i];

			socket.emit("move", {
				x : touch.x / demo.width, 
				y : touch.y / demo.height
			});
		}
	};

	demo.mousemove = mouseHandler;
	demo.mousedown = mouseHandler;
});
