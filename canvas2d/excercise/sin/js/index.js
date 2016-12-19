import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation } from "canvas2d/lib/util";

let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let node = new Node(width/2, height/2, 50);
let range = 350;
let angle = 0;
let speed = 0.1;
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);

	node.setX(width/2 + Math.sin(angle) * range);
	node.setY(height/2 + Math.cos(angle) * range);
	
	angle += speed;

	node.draw(context);
});