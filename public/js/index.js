$(window).on("load", function() {
	 var socket = io.connect("./");

	var diamondImage = $("#diamond")[0];

	var diamonds = $(".diamonds");

	var demo = Sketch.create({
		container: document.getElementById( 'container' )
	});

	function Particle( x, y, radius ) {
		this.init( x, y, radius );
	}

	Particle.prototype = {

		init: function( x, y, radius ) {

			this.alive = true;

			this.radius = radius || 10;
			this.wander = 0.15;
			this.theta = random( TWO_PI );
			this.drag = 0.92;
			this.color = '#fff';

			this.alpha = 0.0;
			this.alphaforce = 0.0;

			this.x = x || 0.0;
			this.y = y || 0.0;

			this.vx = 0.0;
			this.vy = 0.0;
		},

		move: function() {

			this.x += this.vx;
			this.y += this.vy;

			this.vx *= this.drag;
			this.vy *= this.drag;

			this.theta += random( -0.5, 0.5 ) * this.wander;
			this.vx += sin( this.theta ) * 0.1;
			this.vy += cos( this.theta ) * 0.1;

			this.alpha += this.alphaforce;

					this.vy += 0.5;

			if( this.y > demo.height ) {
				this.y = demo.height;
				this.vy *= -0.9;
				this.vx *= 0.0;
			}

			this.radius *= 0.98;
			this.alive = this.radius > 5;
		},

		draw: function( ctx ) {
			ctx.save();
			
			ctx.translate(this.x, this.y);
			var maxDim = max(this.patternImage.width, this.patternImage.height);


			var scaleFactor = (2 * this.radius / maxDim);
			ctx.scale(scaleFactor, scaleFactor);

			ctx.rotate(this.alpha);

			ctx.translate(-0.5 * this.patternImage.width, -0.5 * this.patternImage.height);



			ctx.drawImage(this.patternImage, 0, 0);



			ctx.restore();
		}
	};

	// ----------------------------------------
	// Example
	// ----------------------------------------

	var MAX_PARTICLES = 280;
	var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

	var particles = [];
	var pool = [];



	demo.setup = function() {

		// Set off some initial particles.
		var i, x, y;

		for ( i = 0; i < 20; i++ ) {
			x = ( demo.width * 0.5 ) + random( -100, 100 );
			y = ( demo.height * 0.5 ) + random( -100, 100 );
			demo.spawn( x, y );
		}
	};

	demo.spawn = function( x, y ) {

		if ( particles.length >= MAX_PARTICLES )
			pool.push( particles.shift() );

		particle = pool.length ? pool.pop() : new Particle();
		particle.init( x, y, random( 20,  250) );

		particle.wander = random( 0.5, 2.0 );
		particle.color = random( COLOURS );
		particle.drag = random( 0.9, 0.99 );

		particle.alphaforce = random(-0.1, 0.1);
		particle.patternImage = diamonds[Math.floor(diamonds.length * Math.random())];

		theta = random( TWO_PI );
		force = random( 2, 8 );

		particle.vx = 3.0 * sin( theta ) * force;
		particle.vy = 3.0 * cos( theta ) * force;

		particles.push( particle );
	}

	demo.update = function() {

		var i, particle;

		for ( i = particles.length - 1; i >= 0; i-- ) {

			particle = particles[i];

			if ( particle.alive ) particle.move();
			else pool.push( particles.splice( i, 1 )[0] );
		}
	};

	demo.draw = function() {

		demo.save();


		demo.translate(-0.5 * diamondImage.width, -0.5 * diamondImage.height);
		demo.translate(0.5 * demo.width, 0.5 * demo.height);
		//demo.drawImage(diamondImage, 0, 0);
		demo.restore();

		//demo.globalCompositeOperation  = 'lighter';
		
		for ( var i = particles.length - 1; i >= 0; i-- ) {
			particles[i].draw( demo );
		}
	};

	var mousemove = function(touches) {

		var particle, theta, force, touch, max, i, j, n;

		for ( i = 0, n = touches.length; i < n; i++ ) {

			touch = touches[i], max = random( 1, 2 );
			for ( j = 0; j < max; j++ ) demo.spawn( touch.x, touch.y );
		}
	};

	demo.mousemove = function() {
		//mousemove(demo.touches);
	}

	socket.on("actuate", function(data) {
		mousemove([ {
			x : data.x  * demo.width,
			y : data.y  * demo.height
		}]);
	});
});
