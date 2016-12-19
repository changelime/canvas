import $ from "jquery";
import Node from "canvas2d/lib/node";
import { drawAnimation, angToRad, containsPoint, connectWithLine } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let handles = [];
let handlesNum = 6;
let spring = 0.01;
let friction = 0.9;
let node = new Node(width/2, height/2, 50);
node.setColor("pink");
for(let i = 0; i< handlesNum; i++)
{
	let handle = new Node((width-30)*Math.random(),(height-30)*Math.random(), 30);
	handle.setColor(randomHash());
	handles.push(handle);
}
let springTo = function(node, target){
	let dx = target.getX() - node.getX();
	let dy = target.getY() - node.getY();
	node.setVx(node.getVx() + dx * spring);
	node.setVy(node.getVy() + dy * spring);
};
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
		for( let i = 0; i < handlesNum; i++)
		{
			let node = handles[i];
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
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	handles.forEach(function(item){
		springTo(node, item);
		connectWithLine(context, node, item);
		item.draw(context);
	});
	node.setVx(node.getVx() * friction);
	node.setVy(node.getVy() * friction);
	node.setX(node.getVx(), true);
	node.setY(node.getVy(), true);
	node.draw(context);
});
