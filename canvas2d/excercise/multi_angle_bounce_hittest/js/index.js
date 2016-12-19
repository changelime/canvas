import $ from "jquery";
import Node from "canvas2d/lib/node";
import Line from "canvas2d/lib/line";
import { drawAnimation, angToRad } from "canvas2d/lib/util";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let center = {
	x : width/2,
	y : height/2
};
let gravity = 0.2;
let bounce = -0.6;
let node = new Node(100, 100, 20);

let lines = [];
lines[0] = new Line(0, 0, 200, 0);
lines[0].setXY(100, 200);
lines[0].setRotation(angToRad(10));

lines[1] = new Line(0, 0, 200, 0);
lines[1].setXY(350, 400);
lines[1].setRotation(angToRad(-10));

lines[2] = new Line(0, 0, 200, 0);
lines[2].setXY(100, 500);
lines[2].setRotation(angToRad(20));

lines[3] = new Line(0, 0, 200, 0);
lines[3].setXY(350, 600);
lines[3].setRotation(angToRad(-10));
let checkLine = function(line){
	let cos = Math.cos(line.getRotation());
	let sin = Math.sin(line.getRotation());
	let lineBounds = line.getBounds();
	if( node.getX() + node.getRadius() > lineBounds.x && node.getX() - node.getRadius() <  lineBounds.x + lineBounds.width)
	{
		let x1 = node.getX() - line.getX();
		let y1 = node.getY() - line.getY();
		
		let y2 = y1 * cos - x1 * sin;
		let vy1 = node.getVy() * cos - node.getVx() * sin;
		if( y2 > -(node.getRadius()) && y2 < vy1)
		{
			let x2 = x1 * cos + y1 * sin;

			let vx1 = node.getVx() * cos + node.getVy() * sin;
			

			y2 = -(node.getRadius());
			vy1 *= bounce;
		

			x1 = x2 * cos - y2 * sin;
			y1 = y2 * cos + x2 * sin;

			node.setVx(vx1 * cos - vy1 * sin);
			node.setVy(vy1 * cos + vx1 * sin);

			node.setX(line.getX() + x1);
			node.setY(line.getY() + y1);
		}
	}
};
let drawLine = function(line){
	checkLine(line);
	line.draw(context);
};

let checkWall = function(node) {
	node.setVy(node.getVy() + gravity);
	node.setX(node.getVx(), true);
	node.setY(node.getVy(), true);
	if( node.getX() - node.getRadius() < 0 )
	{
		node.setX(node.getRadius());
		node.setVx(node.getVx() * bounce);
	}
	else if( node.getX() + node.getRadius() > width )
	{
		node.setX(width - node.getRadius());
		node.setVx(node.getVx() * bounce);
	}
	if( node.getY() - node.getRadius() < 0 )
	{
		node.setY(node.getRadius());
		node.setVy(node.getVy() * bounce);
	}
	else if( node.getY() + node.getRadius() > height )
	{
		node.setY(height - node.getRadius());
		node.setVy(node.getVy() * bounce);
	}
};
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	checkWall(node);
	lines.forEach(drawLine);
	node.draw(context);
});