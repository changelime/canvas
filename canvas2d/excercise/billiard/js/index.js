import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation } from "canvas2d/lib/util";

let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let center = {
	x : width/2,
	y : height/2
}
let gravity = 1;
let bounce = -0.6;
let node0 = new Node(20, center.y, 20);
let node1 = new Node(width-20, center.y, 20);
node0.mass = 1;
node1.mass = 2;
node0.vx = 2;
node1.vx = -2;

drawAnimation(()=>{
	context.clearRect(0, 0, width, height);

	node0.setX(node0.vx, true);
	node1.setX(node1.vx, true);
	let dist =  node1.getX() - node0.getX();
	if( Math.abs(dist) < node0.getRadius() + node1.getRadius() )
	{
		let vxT = node0.vx - node1.vx;
		node0.vx = ( (node0.mass - node1.mass) * node0.vx + 2 * node1.mass * node1.vx ) / (node0.mass + node1.mass);
		node1.vx = vxT + node0.vx;

		node0.setX(node0.vx, true);
		node1.setX(node1.vx, true);
	}
	node0.draw(context);
	node1.draw(context);
});
