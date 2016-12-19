import $ from "jquery";
import Node from "canvas2d/lib/node";
import Switcher from "canvas2d/lib/switcher";
import { drawAnimation, connectWithLine } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
var $tools = $("#tools");
let context = $canvas[0].getContext("2d");
var toolsCtx = $tools[0].getContext("2d");
var toolsWidth = $tools.width();
var toolsHeight = $tools.height();
let width = $canvas.width();
let height = $canvas.height();
let center = {
	x : width/2,
	y : height/2
};
let bounce = -0.7;
let minDits = 100;
let springAmount = 0.00002;
let nodes = [];
let nodeNum = 100;
for(let i = 0; i < nodeNum; i++)
{
	let radius = Math.random() * 10 + 5;
	let node = new Node(Math.random() * width, Math.random() * height, radius);
	node.mass = radius / 5;
	node.setVx(Math.random() - 0.5);
	node.setVy(Math.random() - 0.5);
	node.setColor(randomHash());
	nodes.push(node);
}
var modeSwitcher = new Switcher(50, 50, [
	{name: "Spring", value: 0},
	{name: "Gravitate", value: 1}
], "Mode Switcher");
modeSwitcher.captureMouse($tools);
let rotate = function(x, y, sin, cos, reverse){
	return {
		x : (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
		y : (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
	};
};
let checkCollision = function(node0, node1){
	let dx = node1.getX() - node0.getX();
	let dy = node1.getY() - node0.getY();
	let dist = Math.sqrt(dx * dx + dy * dy);
	if( dist < node0.getRadius() + node1.getRadius() )  
	{
		let angle = Math.atan2(dy, dx);
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		//node0作为旋转的中心，坐标为0
		let base = {
			x : node0.getX(),
			y : node0.getY()
		};
		let pos0 = {
			x : 0,
			y : 0
		};

		//以node0为中心，node1旋转之后的坐标
		let pos1 = rotate(dx, dy, sin, cos, true);

		//node0旋转之后的加速度
		// let vel0 = rotate(node0.vx, node0.vy, sin, cos, true);
		let vel0 = rotate(node0.getVx(), node0.getVy(), sin, cos, true);

		//node1旋转之后的加速度
		// let vel1 = rotate(node1.vx, node1.vy, sin, cos, true);
		let vel1 = rotate(node1.getVx(), node1.getVy(), sin, cos, true);

		//碰撞之后的加速度
		let vxTotal = vel0.x - vel1.x;
		vel0.x = ((node0.mass - node1.mass) * vel0.x + 2 * node1.mass * vel1.x) / (node0.mass + node1.mass);
		vel1.x = vxTotal + vel0.x;
		pos0.x += vel0.x;
		pos1.x += vel1.x;

		let absV = Math.abs(vel0.x) + Math.abs(vel1.x);
		let overlap = (node0.getRadius() + node1.getRadius() - Math.abs(pos0.x - pos1.x));
		pos0.x += vel0.x / absV * overlap;
		pos1.x += vel1.x / absV * overlap;


		//旋转回到原本角度
		let pos0f = rotate(pos0.x, pos0.y, sin, cos, false);
		let pos1f = rotate(pos1.x, pos1.y, sin, cos, false);

		//调整球位置
		node0.setX(base.x + pos0f.x);
		node0.setY(base.y + pos0f.y);
		node1.setX(base.x + pos1f.x);
		node1.setY(base.y + pos1f.y);

		//旋转加速度方向
		let vel0f = rotate(vel0.x, vel0.y, sin, cos, false);
		let vel1f = rotate(vel1.x, vel1.y, sin, cos, false);
		node0.setVx(vel0f.x);
		node0.setVy(vel0f.y);
		node1.setVx(vel1f.x);
		node1.setVy(vel1f.y);
	}
};
let gravitate = function(nodeA, nodeB){
	let dx = nodeB.getX() - nodeA.getX();
	let dy = nodeB.getY() - nodeA.getY();
	let distSQ = dx * dx + dy * dy;
	let dist = Math.sqrt(distSQ); 
	let force = nodeA.mass * nodeB.mass / distSQ;
	let ax = force * dx / dist;
	let ay = force * dy / dist;
	// connectWithLine(context, nodeA, nodeB);
	nodeA.setVx(nodeA.getVx() + ax / nodeA.mass);
	nodeA.setVy(nodeA.getVy() + ay / nodeA.mass);
	nodeB.setVx(nodeB.getVx() - ax / nodeB.mass);
	nodeB.setVy(nodeB.getVy() - ay / nodeB.mass);
};
let spring = function(nodeA, nodeB){
	let dx = nodeB.getX() - nodeA.getX();
	let dy = nodeB.getY() - nodeA.getY();
	let dist = Math.sqrt(dx * dx + dy * dy);
	if( minDits > dist ) 
	{
		connectWithLine(context, nodeA, nodeB);
		let ax = dx * springAmount;
		let ay = dy * springAmount;
		// nodeA.vx += ax;
		// nodeA.vy += ay;
		// nodeB.vx -= ax;
		// nodeB.vy -= ay;
		nodeA.setVx(nodeA.getVx() + ax);
		nodeA.setVy(nodeA.getVy() + ay);
		nodeB.setVx(nodeB.getVx() - ax);
		nodeB.setVy(nodeB.getVy() - ay);
	}
};
let move = function(node, index){
	node.setX(node.getVx(), true);
	node.setY(node.getVy(), true);
	let nodeB = null;
	if( node.getX() > width + node.getRadius() )
	{
		node.setX(0);
	}
	else if( node.getX() < (-node.getRadius()) )
	{
		node.setX(width);
	}
	if( node.getY() > height + node.getRadius() )
	{
		node.setY(0);
	}
	else if( node.getY() < (-node.getRadius()) )
	{
		node.setY(height);
	}
	for(let j = index + 1; j < nodeNum; j++)
	{
		nodeB = nodes[j];
		checkCollision(node, nodeB);
		switch (modeSwitcher.getValue()) {
			case 0:
				spring(node, nodeB);
				break;
			case 1:
				gravitate(node, nodeB);
				break;
			default:
				break;
		}
	}
};
let draw = function(node){
	node.draw(context);
};
let drawTools = function(){
	toolsCtx.clearRect(0, 0, toolsWidth, toolsHeight);
	modeSwitcher.draw(toolsCtx);
};
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);	
	nodes.forEach((node, index)=> {
		move(node, index);
		draw(node);
	});
	drawTools();
});