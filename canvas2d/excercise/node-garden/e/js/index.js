(function () {
	var canvas = $("#canvas");
	var context = canvas[0].getContext("2d");
	canvas.attr("width", $(window).width());
	canvas.attr("height", $(window).height());
	canvas.width($(window).width());
	canvas.height($(window).height());
	var time = $("#time>label");
	var width = canvas.width();
	var height = canvas.height();
	var center = {
		x : width/2,
		y : height/2
	}
	var bounce = -0.5;
	var minDits = 150;
	var springAmount = 0.00000001;
	var balls = [];
	var ballNum = 100;
	for(var i = 0; i < ballNum; i++)
	{
		var radius = Math.random() * 10 + 1;
		var ball = new Ball(Math.random() * width, Math.random() * height, radius);
		ball.mass = radius*0.01;
		ball.vx = (0.5 - Math.random()) * 0.3;
		ball.vy = (0.5 - Math.random()) * 0.3;
		// ball.setColor( "#" + (~~(Math.random()*0xffffff)).toString(16) );
		ball.setColor("#ffffff");
		balls.push(ball);
	}
	var rotate = function(x, y, sin, cos, reverse){
		return {
			x : (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
			y : (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
		};
	};
	var checkCollision = function(ball0, ball1){
		var dx = ball1.getX() - ball0.getX();
		var dy = ball1.getY() - ball0.getY();
		var dist = Math.sqrt(dx * dx + dy * dy);
		if( dist < ball0.getRadius() + ball1.getRadius() )  
		{
			var angle = Math.atan2(dy, dx);
			var sin = Math.sin(angle);
			var cos = Math.cos(angle);
			//ball0作为旋转的中心，坐标为0
			var base = {
				x : ball0.getX(),
				y : ball0.getY()
			};
			pos0 = {
				x : 0,
				y : 0
			};

			//以ball0为中心，ball1旋转之后的坐标
			var pos1 = rotate(dx, dy, sin, cos, true);

			//ball0旋转之后的加速度
			var vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true);

			//ball1旋转之后的加速度
			var vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);

			//碰撞之后的加速度
			var vxTotal = vel0.x - vel1.x;
			vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) / (ball0.mass + ball1.mass);
			vel1.x = vxTotal + vel0.x;
			pos0.x += vel0.x;
			pos1.x += vel1.x;

			var absV = Math.abs(vel0.x) + Math.abs(vel1.x);
			var overlap = (ball0.getRadius() + ball1.getRadius() - Math.abs(pos0.x - pos1.x));
			pos0.x += vel0.x / absV * overlap;
			pos1.x += vel1.x / absV * overlap;


			//旋转回到原本角度
			var pos0f = rotate(pos0.x, pos0.y, sin, cos, false);
			var pos1f = rotate(pos1.x, pos1.y, sin, cos, false);

			//调整球位置
			ball0.setX(base.x + pos0f.x);
			ball0.setY(base.y + pos0f.y);
			ball1.setX(base.x + pos1f.x);
			ball1.setY(base.y + pos1f.y);

			//旋转加速度方向
			var vel0f = rotate(vel0.x, vel0.y, sin, cos, false);
			var vel1f = rotate(vel1.x, vel1.y, sin, cos, false);
			ball0.vx = vel0f.x;
			ball0.vy = vel0f.y;
			ball1.vx = vel1f.x;
			ball1.vy = vel1f.y;
		}
	};
	var checkWalls = function(){
		for(var i = 0; i < arguments.length; i++)
		{
			var ball = arguments[i];
			if( ball.getX() + ball.getRadius() > width )
			{
				ball.setX(width - ball.getRadius());
				ball.vx *= bounce;
			}
			else if( ball.getX() - ball.getRadius() < 0 )
			{
				ball.setX(ball.getRadius());
				ball.vx *= bounce;
			}

			if( ball.getY() + ball.getRadius() > height )
			{
				ball.setY(height - ball.getRadius());
				ball.vy *= bounce;
			}
			else if( ball.getY() - ball.getRadius() < 0 )
			{
				ball.setY(ball.getRadius());
				ball.vy *= bounce;
			}
		}
	};
	var gravitate = function(partA, partB){
		var dx = partB.getX() - partA.getX();
		var dy = partB.getY() - partA.getY();
		var distSQ = dx * dx + dy * dy;
		var dist = Math.sqrt(distSQ); 
		var force = partA.mass * partB.mass / distSQ;
		var ax = force * dx / dist;
		var ay = force * dy / dist;

		partA.vx += ax / partA.mass;
		partA.vy += ay / partA.mass;
		partB.vx -= ax / partB.mass;
		partB.vy -= ay / partB.mass;
	};
	var spring = function(partA, partB){
		var dx = partB.getX() - partA.getX();
		var dy = partB.getY() - partA.getY();
		var dist = Math.sqrt(dx * dx + dy * dy);
		if( minDits > dist ) 
		{
			util.connectWithLine(context, partA, partB, "rgba(255,255,255,0.2)");
			var ax = dx * springAmount;
			var ay = dy * springAmount;
			partA.vx += ax;
			partA.vy += ay;
			partB.vx -= ax;
			partB.vy -= ay;
		}
	};
	var move = function(partA, index){
		partA.setX(partA.vx, true);
		partA.setY(partA.vy, true);
		var partB = null;
		if( partA.getX() > width + partA.getRadius() )
		{
			partA.setX(0);
		}
		else if( partA.getX() < (-partA.getRadius()) )
		{
			partA.setX(width);
		}
		if( partA.getY() > height + partA.getRadius() )
		{
			partA.setY(0);
		}
		else if( partA.getY() < (-partA.getRadius()) )
		{
			partA.setY(height);
		}
		for(var j = index + 1; j < ballNum; j++)
		{
			partB = balls[j];
			checkCollision(partA, partB);
			spring(partA, partB);
		}
	};
	var draw = function(ball){
		ball.draw(context);
	};
	var timeStr = "";
	var formet = function(time){
		var str = time + "";
		if (time < 10)
		{
			str = "0" + str;
		}
		return str;
	};
	(function drawFrame(){
		requestAnimationFrame(drawFrame);
		context.clearRect(0, 0, width, height);
		balls.forEach(move);
		// checkWalls.apply(this, balls);
		balls.forEach(draw);
		var date = new Date();
		var now = (
					formet(date.getHours()) 
					+ ":" + 
					formet(date.getMinutes()) 
					+ ":" + 
					formet(date.getSeconds())
					).split("").map(function(item, index, arr){
						return '<i>' + item + '</i>'
					}).join("");
		if(now !== timeStr)
		{
			time.html(now);
			timeStr = now;
		}
	}());
}());