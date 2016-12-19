import $ from "jquery";
import Segment from "canvas2d/lib/segment";
import Node from "canvas2d/lib/node";
import Slider from "canvas2d/lib/slider";
import {getCosinesB, getCosinesC, drawAnimation, radToAng, captureMouse, getAngle, captureArrowKey, getDistance} from "canvas2d/lib/util";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var context = canvas.getContext("2d");
var mouse = captureMouse($canvas);


var vx = 0;
var vy = 0;
var gravity = 0.5;
var bounce = -0.9;
var num = 10;
var segments = [...Array(num)].map(()=>new Segment(width/2, height/2, 30, 15));
var node = new Node(width/2, height/2, 20);
node.setVx(15);
var target = {};

function checkHit(node, seg){
	var dist = getDistance(seg.getPin(), node.getXY());
	if( dist < node.getRadius() )
	{
		node.setVxVy(node.getVx() + Math.random() * 2 - 1, node.getVy() - 1);
	}
}


function moveNode(node){
	node.setVy(node.getVy() + gravity);
	node.setXY(node.getX() + node.getVx(), node.getY() + node.getVy());

	if( node.getX() + node.getRadius() > width )
	{
		node.setX(width - node.getRadius());
		node.setVx(node.getVx() * bounce);
	}
	else if( node.getX() - node.getRadius() < 0 )
	{
		node.setX(node.getRadius());
		node.setVx(node.getVx() * bounce);
	}

	if( node.getY() + node.getRadius() > height )
	{
		node.setY(height - node.getRadius());
		node.setVy(node.getVy() * bounce);
	}
	else if( node.getY() - node.getRadius() < 0 )
	{
		node.setY(node.getRadius());
		node.setVy(node.getVy() * bounce);
	}
}
// function reach(seg, pos){
// 	seg.setRotation(getAngle(pos, seg.getXY()));
// 	var w = seg.getPin().x - seg.getX();
// 	var h = seg.getPin().y - seg.getY();
// 	return {
// 		x: pos.x - w,
// 		y: pos.y - h
// 	};
// }
// function position(segA, segB){
// 	segA.setXY(segB.getPin().x, segB.getPin().y);
// }
// function move(seg, i){
// 	if(i !== 0)
// 	{
// 		target = reach(seg, target);
// 		position(segments[i-1], seg);
// 	}
// }
function reach(segA, segB, pos){
	var dist = getDistance(segA.getXY(), pos);
	var a = segA.getWidth();
	var b = segB.getWidth();
	var c = Math.min(dist, a + b);
	var B = getCosinesB(a, b, c);//Math.acos((b * b - a * a - c * c) / (-2 * a * c));//getCosinesB(a, b, c);
	var C = getCosinesC(a, b, c);//Math.acos((c * c - a * a - b * b) / (-2 * a * b));//getCosinesC(a, b, c);
	var D = getAngle(pos, segA.getXY());
	var E = 0;
	if(pos.x > width /2 )
	{
		E = D + B + Math.PI + C;
		segA.setRotation(D + B);
	}
	else
	{
		E = D - B + Math.PI - C;
		segA.setRotation(D - B);
	}	
	segB.setXY(segA.getPin().x, segA.getPin().y);
	segB.setRotation(E);
	return segB.getPin();
}
function move(seg, i){
	if(i !== segments.length - 1 )
	{
		reach(seg, segments[i+1], target);
	}
}
function draw(seg){
	seg.draw(context);
}
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	// context.fillStyle = "rgba(0,0,0,0.1)";
	// context.fillRect(0, 0, width, height);
	// target = reach(segments[0], node.getXY());
	target = node.getXY();
	moveNode(node);
	segments.reverse().forEach(move);
	segments.reverse().forEach(draw);
	checkHit(node, segments[0])
	node.draw(context);
});