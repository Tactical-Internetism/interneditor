console.log("spray_paint.js");
(function() {
    console.log("loading canvas...");
    var canvas_root_div = document.createElement("DIV");
    canvas_root_div.setAttribute("id", "tactical_internetism_spray_paint_canvas_root_id");
    canvas_root_div.setAttribute("style", "position:absolute;top:0;left:0;height:100%;width:100%;");
    
    var canvas = document.createElement("CANVAS");
	canvas.setAttribute("style", "position:relative;top:0;left:0;height:100%;width:100%;");

    var tmp_canvas = document.createElement("CANVAS");
	tmp_canvas.setAttribute("style", "position:absolute;top:0;left:0;height:100%;width:100%;");

	
	canvas_root_div.appendChild(canvas);
    canvas_root_div.appendChild(tmp_canvas);
	document.body.appendChild(canvas_root_div);
	
	var ctx = canvas.getContext('2d');
	var tmp_ctx = tmp_canvas.getContext('2d');

	var mouse = {x: 0, y: 0};
	var start_mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	var sprayIntervalID;
	
	
	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = 5;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'blue';
	tmp_ctx.fillStyle = 'blue';
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		tmp_canvas.addEventListener('mousemove', onPaint, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		start_mouse.x = mouse.x;
		start_mouse.y = mouse.y;
		
		onPaint();
		sprayIntervalID = setInterval(onPaint, 50);
	}, false);
	
	tmp_canvas.addEventListener('mouseup', function() {
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		clearInterval(sprayIntervalID);
	}, false);
	
	var onPaint = function() {
		
		// Tmp canvas is always cleared up before drawing.
		// tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		var x = mouse.x;
		var y = mouse.y;
		console.log(mouse.x, mouse.y);
		
		generateSprayParticles();
	};
	
	var getRandomOffset = function(radius) {
		var random_angle = Math.random() * (2*Math.PI);
		var random_radius = Math.random() * radius;
		
		// console.log(random_angle, random_radius, Math.cos(random_angle), Math.sin(random_angle));
		
		return {
			x: Math.cos(random_angle) * random_radius,
			y: Math.sin(random_angle) * random_radius
		};
	};
	
	var generateSprayParticles = function() {
		// Particle count, or, density
		var density = 50;
		
		for (var i = 0; i < density; i++) {
			var offset = getRandomOffset(10);
			
			var x = mouse.x + offset.x;
			var y = mouse.y + offset.y;
			
			tmp_ctx.fillRect(x, y, 1, 1);
		}
	};
	
}());