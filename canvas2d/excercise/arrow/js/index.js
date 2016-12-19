import $ from "jquery";
import Arrow from "canvas2d/lib/arrow";
import { drawAnimation, captureMouse } from "canvas2d/lib/util";

var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
let context = canvas.getContext("2d");
let mouse = captureMouse($canvas);
let arrow = new Arrow(width/2, height/2);
let speed = 5;
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	let dx = mouse.x - arrow.getX();
	let dy = mouse.y - arrow.getY();
	let angle = Math.atan2(dy, dx);
	let vx = Math.cos(angle) * speed;
	let vy = Math.sin(angle) * speed;
	arrow.setRotation(angle);
	arrow.setX(vx, true);
	arrow.setY(vy, true);	
	arrow.draw(context);
});