import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, containsPoint, connectWithLine } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let nodes = [];
let nodesNum = 3;
let spring = 0.03;
let springLengh = 150;
let friction = 0.9;
let bounce = 0.5;
for(let i = 0; i < nodesNum; i++)
{
	let node = new Node(width*Math.random(), height*Math.random(), 20);
	node.setColor(randomHash());
	nodes.push(node);
}
let mouse = {
	down : false,
	x : 0,
	y : 0,
	target : null
};
$canvas.on("mousedown", null, function(event) {
	mouse.down = true;
});
$canvas.on("mouseup", null, function(event) {
	if(mouse.down && mouse.target instanceof Node)
	{
		mouse.target = null;
	}
	mouse.down = false;
});
$canvas.on("mousemove", null, function(event) {
	if(mouse.down)
	{
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
		for( let i = 0; i < nodes.length; i++)
		{
			let node = nodes[i];
			if( (mouse.target === null || node === mouse.target) && containsPoint(node.getBounds(), mouse.x, mouse.y) )
			{
				node.setX(mouse.x);
				node.setY(mouse.y);
				mouse.target = node;
				return true;
			}
		}
	}
});
let springTo = function(nodeA, nodeB) {
	let dx = nodeB.getX() - nodeA.getX();
	let dy = nodeB.getY() - nodeA.getY();
	let angle = Math.atan2(dy, dx);
	let tx = nodeB.getX() - Math.cos(angle) * springLengh;
	let ty = nodeB.getY() - Math.sin(angle) * springLengh;

	nodeA.setVx(nodeA.getVx() + (tx - nodeA.getX()) * spring);
	nodeA.setVy(nodeA.getVy() + (ty - nodeA.getY()) * spring);

	nodeA.setVx(nodeA.getVx() * friction);
	nodeA.setVy(nodeA.getVy() * friction);

	nodeA.setX(nodeA.getVx(), true);
	nodeA.setY(nodeA.getVy(), true);
}
let draw = function(node, index) {
	let nextnode = null;
	let prevnode = null;
	if(index === nodes.length -1)
	{
		nextnode = nodes[0];
	}
	else
	{
		nextnode = nodes[index + 1];
	}
	if( index === 0 )
	{
		prevnode = nodes[nodes.length -1];
	}
	else
	{
		prevnode = nodes[index - 1];
	}
	springTo(prevnode, node);
	springTo(nextnode, node);
	connectWithLine(context, node.getXY(), nextnode.getXY());
	node.draw(context);
}
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	nodes.forEach(draw);
});