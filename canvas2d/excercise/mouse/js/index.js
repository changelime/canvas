import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, containsPoint, captureMouse } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();

let gravity = 0.2;
let bounce = -0.8;
let node = new Node(width/2, height-20, 40);
node.setColor(randomHash());

let mouse = captureMouse($canvas);
mouse.down = false;
let oldX = 0;
let oldY = 0;

$canvas.on("mousedown", null, function(event) {
	if( containsPoint(node.getBounds(), mouse.x, mouse.y) )
	{
		mouse.down = true;
		oldX = node.getX();
		oldY = node.getY();
	}
});
$canvas.on("mouseup", null, function(event) {
	mouse.down = false;
});
$canvas.on("mousemove", null, function(event) {
	if(mouse.down)
	{
		node.setX(mouse.x);
		node.setY(mouse.y);
	}
});
let trackVelocity = function(node) {
	node.setVx(node.getX() - oldX);
	node.setVy(node.getY() - oldY);
	oldX = node.getX();
	oldY = node.getY();
}
let checkWall = function(node) {
	node.setVy(node.getVy() + gravity);
	node.setX(node.getVx(), true);
	node.setY(node.getVy(), true);
	if( (node.getY() - node.getRadius()) < 0) 
	{
		node.setY(node.getRadius());
		node.setVy(node.getVy() * bounce);
	}
	else if( (node.getY()+node.getRadius()) > height )
	{
		node.setY(height - node.getRadius());
		node.setVy(node.getVy() * bounce);
	}
	if( (node.getX() - node.getRadius()) < 0 )
	{
		node.setX(node.getRadius());
		node.setVx(node.getVx() * bounce);
	}
	else if( (node.getX()+node.getRadius()) > width )
	{
		node.setX(width - node.getRadius());
		node.setVx(node.getVx() * bounce);
	}
}
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	if(mouse.down)
	{
		trackVelocity(node);
	}
	else
	{
		checkWall(node);
	}
	node.draw(context);
});
