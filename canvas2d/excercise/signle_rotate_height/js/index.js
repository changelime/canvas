import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, connectWithLine } from "canvas2d/lib/util";

let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let center = {
	x : width/2,
	y : height/2
};
let node = new Node(center.x, 100, 20);
node.setColor("#8A8CB2");
let vr = 0.05;
let cos = Math.cos(vr);
let sin = Math.sin(vr);

drawAnimation(()=>{
	context.clearRect(0, 0, width, height);

	let x1 = node.getX() - center.x;
	let y1 = node.getY() - center.y;
	let x2 = x1 * cos - y1 * sin;
	let y2 = y1 * cos + x1 * sin;

	node.setX(center.x + x2);
	node.setY(center.y + y2);
	node.draw(context);
});