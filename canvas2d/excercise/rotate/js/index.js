import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, angToRad, getDistance } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
var center = {
	x : width/2,
	y : height/2
};
var base = 50;
var s = new Node(width/2, base, 20);
var m = new Node(width/2, base + 60, 25);
var h = new Node(width/2, base + 130, 30);
s.setColor(randomHash());
m.setColor(randomHash());
h.setColor(randomHash());
var drawUntil = function(limt, o, context){
	var r = getDistance(center, o.getXY());
	o.setX( center.x + Math.cos(limt) * r );
	o.setY( center.y + Math.sin(limt) * r );
	o.draw(context);
};
drawAnimation(()=>{	
	context.fillStyle = "rgba(0, 0, 0, 0.05)";
	context.fillRect(0, 0, width, height);
	var time = ((Date.now() % 86400000) / 1000);
	var secon = time % 60;
	var min = time / 60 % 60;
	var hor = (time / 60 / 60 + 8) % 12;
	drawUntil(angToRad((secon * 6) - 90 ), s, context);
	drawUntil(angToRad((min * 6) - 90 ), m, context);
	drawUntil(angToRad((hor * 30) - 90 ), h, context);
});