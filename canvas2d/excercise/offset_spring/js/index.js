import $ from "jquery";
import Node from "canvas2d/lib/node";
import {drawAnimation, captureMouse, connectWithLine} from "canvas2d/lib/util";
let $canvas = $("#canvas");
let canvas = $canvas[0];
let width = $canvas.width();
let height = $canvas.height();
let context = canvas.getContext("2d");
let spring = 0.03;
let gravity = 2;
let friction = 0.8;
let springOffset = 100;
let node = new Node(width/2, height/2, 50);
node.setColor("pink");
let draw = function(node) {
	let dx = node.getX() - mouse.x;
	let dy = node.getY() - mouse.y;

	let angle = Math.atan2(dy, dx);
	let tx = mouse.x + Math.cos(angle) * springOffset;
	let ty = mouse.y + Math.sin(angle) * springOffset;

	let vx = node.getVx() + (tx - node.getX()) * spring;
	let vy = node.getVy() + (ty - node.getY()) * spring;
	
	vy += gravity;

	vx *= friction;
	vy *= friction;

	node.setVx(vx);
	node.setVy(vy);
	node.setX(node.getVx(), true);
	node.setY(node.getVy(), true);
	connectWithLine(context, mouse, node.getXY());
	node.draw(context);
};
let mouse = captureMouse($canvas);
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	draw(node);
});