import $ from "jquery";
import Node from "canvas2d/lib/node";
import Slider from "canvas2d/lib/slider";
import { drawAnimation, angToRad } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
var $tools = $("#tools");
let context = $canvas[0].getContext("2d");
var toolsCtx = $tools[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
var toolsWidth = $tools.width();
var toolsHeight = $tools.height();
let nodes = [];
let nodeNum = 200;
var gravitySlider = new Slider(50, 50, 0, 5, 0.5, "gravity");
var burstSlider = new Slider(100, 50, 0, 50, 12, "burst");
var rangeSlider = new Slider(50, 200, 0, 180, 10, "range");
var offsetSlider = new Slider(100, 200, -180, 180, -95, "offset");
gravitySlider.captureMouse($tools);
burstSlider.captureMouse($tools);
rangeSlider.captureMouse($tools);
offsetSlider.captureMouse($tools);
let initX = width / 2;
let initY = height - 20;
let initNode = function(node) {
	node.setXY(initX, initY);
	let rad = angToRad(rangeSlider.getValue());
	rad = angToRad(offsetSlider.getValue()) + (Math.random() * rad);
	let force = burstSlider.getValue() + burstSlider.getValue() * Math.random();
	let tx = initX + Math.cos(rad) * force;
	let ty = initY + Math.sin(rad) * force;
	let dx = tx - initX;
	let dy = ty - initY;
	node.setVx(dx);
	node.setVy(dy);
}
for(let i = 0; i < nodeNum; i++)
{
	let node = new Node(initX, initY, 5);
	node.setColor(randomHash());
	initNode(node);
	nodes.push(node);
}
let checkWalls = function(node){
	if( node.getX() + node.getRadius() > width ||
		node.getX() - node.getRadius() < 0 ||
		node.getY() + node.getRadius() > height ||
		node.getY() - node.getRadius() < 0 )
	{
		initNode(node);
	}
};
let draw = function(node) {
	node.setVy(node.getVy() + gravitySlider.getValue());
	checkWalls(node);
	node.setX(node.getVx(), true);
	node.setY(node.getVy(), true);
	node.draw(context);
};
let clearRect = function() {
	context.clearRect(0, 0, width, height);
	toolsCtx.clearRect(0, 0, toolsWidth, toolsHeight);
};
let drawSlider = function() {
	gravitySlider.draw(toolsCtx);
	burstSlider.draw(toolsCtx);
	rangeSlider.draw(toolsCtx);
	offsetSlider.draw(toolsCtx);
};
drawAnimation(()=>{
	clearRect();
	nodes.forEach(draw);
	drawSlider();
});