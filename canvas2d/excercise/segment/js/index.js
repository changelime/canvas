import $ from "jquery";
import Segment from "canvas2d/lib/segment";
import Slider from "canvas2d/lib/slider";
import {drawAnimation, angToRad} from "canvas2d/lib/util";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var context = canvas.getContext("2d");

var cycle = 0;
var offset = -1.57;

var vx = 0;
var vy = 0;

var segment0 = new Segment(300, 400, 50, 15);
var segment1 = new Segment(300, 400, 50, 10);
var segment2 = new Segment(300, 400, 50, 15);
var segment3 = new Segment(300, 400, 50, 10);

var gravitySlider = new Slider(200, 50, 0, 1, 0.2, "gravity");
var speedSlider = new Slider(300, 50, 0, 0.2, 0.08, "speed");
var thighRangeSlider = new Slider(400, 50, 0, 90, 45, "thighRange");
var thighBaseSlider = new Slider(500, 50, 0, 180, 90, "thighBase");
var calfRangeSlider = new Slider(600, 50, 0, 90, 45, "calfRange");
var calfOffsetSlider = new Slider(700, 50, -Math.PI, Math.PI, -(Math.PI/2), "calfOffset");

gravitySlider.captureMouse($canvas);
speedSlider.captureMouse($canvas);
thighRangeSlider.captureMouse($canvas);
thighBaseSlider.captureMouse($canvas);
calfRangeSlider.captureMouse($canvas);
calfOffsetSlider.captureMouse($canvas);

function setVelocity(){
	vy += gravitySlider.getValue();
	segment0.setXY(segment0.getX() + vx, segment0.getY() + vy);
	segment2.setXY(segment2.getX() + vx, segment2.getY() + vy);
}
function checkFloor(seg){
	var yMax = seg.getPin().y + (seg.getHeight() / 2);
	if( yMax > height )
	{
		var dy = yMax - height;
		segment0.setY(segment0.getY() - dy);
		segment1.setY(segment1.getY() - dy);
		segment2.setY(segment2.getY() - dy);
		segment3.setY(segment3.getY() - dy);
		vx -= seg.getVx();
		vy -= seg.getVy();
	}
}
function checkWalls(){
	var w = width + 200;
	if( segment0.getX() > width + 100 )
	{
		segment0.setX(segment0.getX() - w);
		segment1.setX(segment1.getX() - w);
		segment2.setX(segment2.getX() - w);
		segment3.setX(segment3.getX() - w);
	}
	else if( segment0.getX() < -100 )
	{
		segment0.setX(segment0.getX() + w);
		segment1.setX(segment1.getX() + w);
		segment2.setX(segment2.getX() + w);
		segment3.setX(segment3.getX() + w);
	}
}
function walk(segA, segB, cyc){
	var rad = angToRad((Math.sin(cyc) * thighRangeSlider.getValue() + thighBaseSlider.getValue()));
	var rad1 = angToRad((Math.sin(cyc + calfOffsetSlider.getValue()) * calfRangeSlider.getValue() + calfRangeSlider.getValue()));
	var foot = segB.getPin();
	
	segA.setRotation(rad);
	segB.setRotation(segA.getRotation() + rad1);
	segB.setXY(segA.getPin().x, segA.getPin().y);

	segB.setVxVy(segB.getPin().x - foot.x, segB.getPin().y - foot.y)
}
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);

	cycle += speedSlider.getValue();
	setVelocity()
	walk(segment0, segment1, cycle);
	walk(segment2, segment3, cycle + Math.PI );

	checkFloor(segment1);
	checkFloor(segment3);
	checkWalls();

	segment0.draw(context);
	segment1.draw(context);
	segment2.draw(context);
	segment3.draw(context);

	gravitySlider.draw(context);
	speedSlider.draw(context);
	thighRangeSlider.draw(context);
	thighBaseSlider.draw(context);
	calfRangeSlider.draw(context);
	calfOffsetSlider.draw(context);
});