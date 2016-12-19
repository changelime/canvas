import $ from "jquery";
import Node from "canvas2d/lib/node";
import { randomHash } from "canvas2d/lib/color";
import { drawAnimation, angToRad, getAngle, intersectsDis, getVelocity } from "canvas2d/lib/util";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let nodes = [];
let nodesNum = 20;
let spring = 0.3;
let gravity = 0.1;
let bounce = -0.75;
for( let i = 0; i < nodesNum; i++ )
{
	let radius = 30 * Math.random() + 10;
	let node = new Node(width * Math.random(), height * Math.random(), radius);
	node.setColor(randomHash());
	node.vx = Math.random() * 6 - 3;
	node.vy = Math.random() * 6 - 3;
	nodes.push(node);
}

let checkCollision = function(nodeA, i) {
	for( let j = i + 1; j < nodesNum; j++ )
	{
		let nodeB = nodes[j];
		

		if( intersectsDis(nodeA, nodeB) )
		{
			let dx = nodeB.getX() - nodeA.getX();
			let dy = nodeB.getY() - nodeA.getY();
			let min_dist = nodeA.getRadius() + nodeB.getRadius();
			let angle = Math.atan2(dy, dx);
			let tx = nodeA.getX() + Math.cos(angle) * min_dist;
			let ty = nodeA.getY() + Math.sin(angle) * min_dist;
			let ax = (tx - nodeB.getX()) * spring * 0.5;
			let ay = (ty - nodeB.getY()) * spring * 0.5;
			nodeA.vx -= ax;
			nodeA.vy -= ay;
			nodeB.vx += ax;
			nodeB.vy += ay;
		}
	}
}

let move = function(node) {
	node.vy += gravity;
	node.setX(node.vx, true);
	node.setY(node.vy, true);
	if( (node.getY() - node.getRadius()) < 0) 
	{
		node.setY(node.getRadius());
		node.vy *= bounce;
	}
	else if( (node.getY()+node.getRadius()) > height )
	{
		node.setY(height - node.getRadius());
		node.vy *= bounce;
	}
	if( (node.getX() - node.getRadius()) < 0 )
	{
		node.setX(node.getRadius());
		node.vx *= bounce;
	}
	else if( (node.getX()+node.getRadius()) > width )
	{
		node.setX(width - node.getRadius());
		node.vx *= bounce;
	}
}
let draw = function(node) {
	node.draw(context);
}
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	nodes.forEach(checkCollision);
	nodes.forEach(move);
	nodes.forEach(draw);
});
