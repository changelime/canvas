import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, captureMouse } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let center = {
	x : width/2,
	y : height/2
};
let mouse = captureMouse($canvas);
let nodeNum = 10;
let nodes = [];
let setAngleBaseOn = function(node, angle){
	node.__angle = 0.01 + node.__base * angle;
	node.__cos = Math.cos(node.__angle);
	node.__sin = Math.sin(node.__angle);
};
for(let i = 0; i < nodeNum; i++)
{
	let node = new Node(center.x, Math.random()*height, 10 + Math.random()*20);
	node.setColor(randomHash());
	node.__base = Math.random();
	setAngleBaseOn(node, 0.05);
	nodes.push(node);
}
let updateCurrentAngle = function(node) {
	setAngleBaseOn(node, (mouse.x - center.x) * 0.0005);

	let x1 = node.getX() - center.x;
	let y1 = node.getY() - center.y;
	let x2 = x1 * node.__cos - y1 * node.__sin;
	let y2 = y1 * node.__cos + x1 * node.__sin;

	node.setX(center.x + x2);
	node.setY(center.y + y2);
};


drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	nodes.forEach(function(node){
		updateCurrentAngle(node);
		node.draw(context);
	});
});