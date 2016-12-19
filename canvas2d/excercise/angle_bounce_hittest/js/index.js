import $ from "jquery";
import Line from "canvas2d/lib/line";
import Node from "canvas2d/lib/node";
import {angToRad, drawAnimation} from "canvas2d/lib/util";

let canvas = $("#canvas");
let context = canvas[0].getContext("2d");
let width = canvas.width();
let height = canvas.height();
let center = {
	x : width/2,
	y : height/2
};
let gravity = 1;
let bounce = -0.6;

let line = new Line(0, 0, 500, 0);
line.setXY(100, 500);
line.setRotation(angToRad(10));

let node = new Node(100, 100, 20);
node.vy = 0;
node.vx = 0;
let cos = Math.cos(line.getRotation());
let sin = Math.sin(line.getRotation());

drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	node.vy += gravity;
	node.setX(node.vx, true);
	node.setY(node.vy, true);

	if( node.getX() - node.getRadius() < 0 )
	{
		node.setX(node.getRadius());
		node.vx *= bounce;
	}
	else if( node.getX() + node.getRadius() > width )
	{
		node.setX(width - node.getRadius());
		node.vx *= bounce;
	}
	if( node.getY() - node.getRadius() < 0 )
	{
		node.setY(node.getRadius());
		node.vy *= bounce;
	}
	else if( node.getY() + node.getRadius() > height )
	{
		node.setY(height - node.getRadius());
		node.vy *= bounce;
	}


	let lineBounds = line.getBounds();
	if( node.getX() + node.getRadius() > lineBounds.x && node.getX() - node.getRadius() <  lineBounds.x + lineBounds.width)
	{
		let x1 = node.getX() - line.getX();
		let y1 = node.getY() - line.getY();
		
		let y2 = y1 * cos - x1 * sin;
		let vy1 = node.vy * cos - node.vx * sin;
		if( y2 > -(node.getRadius()) && y2 < vy1)
		{
			let x2 = x1 * cos + y1 * sin;

			let vx1 = node.vx * cos + node.vy * sin;
			

			y2 = -(node.getRadius());
			vy1 *= bounce;
		

			x1 = x2 * cos - y2 * sin;
			y1 = y2 * cos + x2 * sin;

			node.vx = vx1 * cos - vy1 * sin;
			node.vy = vy1 * cos + vx1 * sin;

			node.setX(line.getX() + x1);
			node.setY(line.getY() + y1);
		}
	}
	line.draw(context);
	node.draw(context);
});