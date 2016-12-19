import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, connectWithLine, captureMouse} from "canvas2d/lib/util";
import Slider from "canvas2d/lib/slider";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
var $tools = $("#tools");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
var toolsCtx = $tools[0].getContext("2d");
var toolsWidth = $tools.width();
var toolsHeight = $tools.height();
let nodes = [];
let nodesNum = 20;
let mouse = captureMouse($canvas);
var gravitySlider = new Slider(50, 50, 0, 5, 2, "gravity");
var springSlider = new Slider(100, 50, 0, 0.1, 0.07, "spring");
var frictionSlider = new Slider(50, 200, 0, 1, 0.7, "friction");
gravitySlider.captureMouse($tools);
springSlider.captureMouse($tools);
frictionSlider.captureMouse($tools);
for(let i = 0; i < nodesNum; i++)
{
	let node = new Node(20, height/2, 10);
	nodes.push(node);
}

let move = function(node, target){
	let dx = target.x - node.getX();
	let dy = target.y - node.getY();
	let ax = dx * springSlider.getValue();
	let ay = dy * springSlider.getValue();
	let vx = node.getVx() + ax;
	let vy = node.getVy() + ay;
	vy += gravitySlider.getValue();
	vx *= frictionSlider.getValue();
	vy *= frictionSlider.getValue();
	node.setVx(vx);
	node.setVy(vy);
	node.setX(node.getVx(), true);
	node.setY(node.getVy(), true);
	connectWithLine(context, node, target);
};
let draw = function(node, index) {
	if(index === 0)
	{
		move(node, mouse);
	}
	else
	{
		let prenode = nodes[index -1];
		move(node, prenode.getXY());
	}
	node.draw(context);
};
let drawSlider = function() {
	gravitySlider.draw(toolsCtx);
	springSlider.draw(toolsCtx);
	frictionSlider.draw(toolsCtx);
};
let clearRect = function() {
	context.clearRect(0, 0, width, height);
	toolsCtx.clearRect(0, 0, toolsWidth, toolsHeight);
};
drawAnimation(()=>{
	clearRect();
	nodes.forEach(draw);
	drawSlider();
});