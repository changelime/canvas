import $ from "jquery"
import {captureMouse, connectWithLine, drawAnimation} from "canvas2d/lib/util";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var mouse = captureMouse($canvas);
var context = canvas.getContext("2d");
var x0 = 0;
var y0 = 0;
var x1 = 800;
var y1 = 800;

drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	// var ctrlPoint = {
	// 	x: mouse.x * 2 - (x0 + x1) / 2,
	// 	y: mouse.y * 2 - (y0 + y1) / 2
	// };	
	context.save();
	context.beginPath();
	context.moveTo(x0, y0);
	context.quadraticCurveTo(mouse.x, mouse.y, x1, y1);
	context.stroke();
	context.restore();
	connectWithLine(context, {x: x0, y: y0}, mouse);
	connectWithLine(context, {x: x1, y: y1}, mouse);
});