
export function connectWithLine(context, now, target, color){
	now = (now.getX && {x: now.getX(), y: now.getY()}) || now;
	target = (target.getX && {x: target.getX(), y: target.getY()}) || target;
	context.save();
	context.strokeStyle = color ? color : "white";
	context.beginPath();
	context.moveTo(now.x, now.y);
	context.lineTo(target.x, target.y);
	context.stroke();
	context.closePath();
	context.restore();
}

export function radToAng(rag){
	return rag * 180 / Math.PI;
}
export function angToRad(ang){
	return ang * Math.PI / 180;
}
export function getOffset(fixed, ball, offset){
	var angle = getAngle(ball, fixed);
	var target = decomposeVelocity(angle, offset);
	return {
		x : fixed.x + target.x,
		y : fixed.y + target.y
	}
}
export function getAngle(pos1, pos2){
	var dx = pos1.x - pos2.x;
	var dy = pos1.y - pos2.y;
	return Math.atan2(dy, dx);
}
export function decomposeVelocity(angle, force){
	return {
		x : Math.cos(angle) * force,
		y : Math.sin(angle) * force
	};
}
export function getDistance(pos1, pos2){
	var dx = pos1.x - pos2.x;
	var dy = pos1.y - pos2.y;
	return Math.sqrt(dx * dx + dy * dy);
}
export function getCosinesA(a, b, c){
	return Math.acos((b * b + c * c - a * a) / (2 * b * c));
}
export function getCosinesB(a, b, c){
	return Math.acos((a * a + c * c - b * b) / (2 * a * c));
}
export function getCosinesC(a, b, c){
	return Math.acos((a * a + b * b - c * c) / (2 * a * b));
}
export function getVelocity(pos1, pos2){
	return {
		angle : getAngle(pos1, pos2),
		distance : getDistance(pos1, pos2)
	};
}
export function containsPoint(ract, x, y){
	return !(x < ract.x || x > ract.x + ract.width || y < ract.y || y > ract.y + ract.height);
}
export function intersectsRect(rectA, rectB){
	return !( rectA.x + rectA.width < rectB.x ||
				rectB.x + rectB.width < rectA.x ||
				rectA.y + rectA.height < rectB.y ||
				rectB.y + rectB.height < rectA.y );
}
export function intersectsDis(obj1, obj2){
	var pos1 = obj1.calculate(true);
	var pos2 = obj2.calculate(true);
	var dis = getDistance({
		x : pos1.x + obj1.getX(),
		y : pos1.y + obj1.getY()
	},{
		x : pos2.x + obj2.getX(),
		y : pos2.y + obj2.getY()
	});
	if( obj1.getRadius() + obj2.getRadius() >=  dis)
	{
		return true;
	}
	return false;
}

export function captureMouse($el){
	var mouse = {
		x: 0,
		y: 0
	};
	$el.on("mousemove", null, function(event){
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
	});
	return mouse;
}
export function captureArrowKey($el){
	var pos = {
		arrow: "up"
	};//up, left, down, right
	$el.on("keydown", null, function(event){
		switch(event.keyCode)
		{
			case 38:
				pos.arrow = "up";
				break;
			case 40:
				pos.arrow = "down";
				break;
			case 37:
				pos.arrow = "left";
				break;
			case 39:
				pos.arrow = "right";
				break;
		}
	});
	return pos;
}
export function drawAnimation(callback){
	function drawFrame(){
		callback();
		requestAnimationFrame(drawFrame);
	}
	requestAnimationFrame(drawFrame);
}

var util = {
	connectWithLine,
	radToAng,
	angToRad,
	getOffset,
	getAngle,
	decomposeVelocity,
	getDistance,
	getVelocity,
	containsPoint,
	intersectsRect,
	intersectsDis,
	captureMouse,
	captureArrowKey,
	drawAnimation,
	getCosinesA,
	getCosinesB,
	getCosinesC
};

export default util;	