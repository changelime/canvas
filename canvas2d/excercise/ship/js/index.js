import $ from "jquery";
import Ship from "canvas2d/lib/ship";
import { drawAnimation, angToRad } from "canvas2d/lib/util";
let $canvas = $("#canvas");
let context = $canvas[0].getContext("2d");
let width = $canvas.width();
let height = $canvas.height();
let ship = new Ship(width/2, height/2);
let vr = 0;
let thust = 0;
let gravity = 0;//0.1;

$(window).on("keyup", null, function(event) {
	vr = 0;
	if(event.keyCode === 38)
	{
		ship.flameout();
		thust = 0;
	}
});
$(window).on("keydown", null, function(event) {
	switch(event.keyCode)
	{
		case 37://left
			vr = -3;
			break;
		case 39://right
			vr = 3;
			break;
		case 38://fire
			thust = 0.15;
			ship.flame();
			break;
	}
});
let fr = 0;
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	fr = ship.getRotation() + angToRad(vr);
	ship.setRotation(fr);//设置物体朝向
	let ax = Math.cos(fr) * thust;
	let ay = Math.sin(fr) * thust;
	ship.setVx(ship.getVx() + ax);
	ship.setVy(ship.getVy() + ay);
	ship.setVy(ship.getVy() + gravity);
	ship.setX(ship.getVx(), true);
	ship.setY(ship.getVy(), true);
	// ship.vs.flame.set(fr, thust);//引擎加速度
	// ship.vs.gravity.set(angToRad(90), 0.1);//重力加速度
	// ship.run(true, false);//根据当前速度向量设置位置，在当前位置更新
	ship.draw(context);
});