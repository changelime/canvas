import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, captureMouse } from "canvas2d/lib/util";

let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let node = new Node(width / 2, height / 2, 20);
let easing = 0.05;
let mouse = captureMouse($canvas);


drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	let vx = (mouse.x - node.getX()) * easing;
	let vy = (mouse.y - node.getY()) * easing;
	node.setX(vx, true);
	node.setY(vy, true);
	node.draw(context);
});