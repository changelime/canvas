import $ from "jquery";
import Node from "canvas2d/lib/node";
import Slider from "canvas2d/lib/slider";
import { drawAnimation, angToRad, containsPoint, intersectsDis } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let nodes = [];
let nodesNum = 10;
let spring = 0.2;
let gravity = 0.2;
let now = null;
let createObj = function(){
	let radius = 30 * Math.random() + 10;
	let node = new Node(width*Math.random(), radius , radius);
	node.setColor(randomHash());
	nodes.push(node);
	return node;
};
now = createObj();
let mouse = {
	x : 0,
	y : 0,
	target : null
};
$canvas.on("mousedown", null, function(event) {
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
	for( let i = 0; i < nodes.length; i++)
	{
		let node = nodes[i];
		if(  containsPoint(node.getBounds(), mouse.x, mouse.y) )
		{
			mouse.target = node;
			return true;
		}
	}
});
$canvas.on("mouseup", null, function(event) {
	mouse.target = null;
});
$canvas.on("mousemove", null, function(event) {
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
	if( mouse.target !== null )
	{
		mouse.target.setX(mouse.x);
		mouse.target.setY(mouse.y);
	}
});
let checkHit = function(node) {
	if( now !== node && intersectsDis(node, now) )
	{
		now.setY((node.getY() - node.getRadius()) - now.getRadius());
		now = createObj();
	}
	node.draw(context);
};
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	now.setVy(now.getVy() + gravity);
	now.setY(now.getVy(), true);
	if(now.getY() + now.getHeight() > height)
	{
		now.setY(height - now.getRadius());
		now = createObj();
	}
	nodes.forEach(checkHit);
});