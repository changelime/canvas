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
let bounce = -1.0;
let node0 = new Node(100, 100, 70);
let node1 = new Node(width-100, height-100, 50);
node0.mass = 5;
node0.vx = Math.random() * 30 - 5;
node0.vy = Math.random() * 30 - 5;

node1.mass = 1;
node1.vx = Math.random() * 30 - 5;
node1.vy = Math.random() * 30 - 5;

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
		let baseX = node0.getX();
		let baseY = node0.getY();
		let x0 = 0;
		let y0 = 0;

		//以node0为中心，node1旋转之后的坐标
		let x1 = dx * cos + dy * sin;
		let y1 = dy * cos - dx * sin;

		//node0旋转之后的加速度
		let vx0 = node0.vx * cos + node0.vy * sin;
		let vy0 = node0.vy * cos - node0.vx * sin;

		//node1旋转之后的加速度
		let vx1 = node1.vx * cos + node1.vy * sin;
		let vy1 = node1.vy * cos - node1.vx * sin;

		//碰撞之后的加速度
		let vxTotal = vx0 - vx1;
		vx0 = ((node0.mass - node1.mass) * vx0 + 2 * node1.mass * vx1) / (node0.mass + node1.mass);
		vx1 = vxTotal + vx0;
		x0 += vx0;
		x1 += vx1;

		//旋转回到原本角度
		let x0f = x0 * cos - y0 * sin;
		let y0f = y0 * cos + x0 * sin;
		let x1f = x1 * cos - y1 * sin;
		let y1f = y1 * cos + x1 * sin;

		//调整球位置
		node0.setX(baseX + x0f);
		node0.setY(baseY + y0f);
		node1.setX(baseX + x1f);
		node1.setY(baseY + y1f);

		//旋转加速度方向
		node0.vx = vx0 * cos - vy0 * sin;
		node0.vy = vy0 * cos + vx0 * sin;
		node1.vx = vx1 * cos - vy1 * sin;
		node1.vy = vy1 * cos + vx1 * sin;
	}
};
let checkWalls = function(){
	for(let i = 0; i < arguments.length; i++)
	{
		let node = arguments[i];
		if( node.getX() + node.getRadius() > width )
		{
			node.setX(width - node.getRadius());
			node.vx *= bounce;
		}
		else if( node.getX() - node.getRadius() < 0 )
		{
			node.setX(node.getRadius());
			node.vx *= bounce;
		}

		if( node.getY() + node.getRadius() > height )
		{
			node.setY(height - node.getRadius());
			node.vy *= bounce;
		}
		else if( node.getY() - node.getRadius() < 0 )
		{
			node.setY(node.getRadius());
			node.vy *= bounce;
		}
	}
};

drawAnimation(()=>{
	context.clearRect(0, 0, width, height);

	node0.setX(node0.vx, true);
	node0.setY(node0.vy, true);
	node1.setX(node1.vx, true);
	node1.setY(node1.vy, true);
	checkCollision(node0, node1);
	checkWalls(node0, node1);
	node0.draw(context);
	node1.draw(context);
});