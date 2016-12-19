import $ from "jquery";
import Segment from "canvas2d/lib/segment";
import Slider from "canvas2d/lib/slider";
import {drawAnimation, radToAng, captureMouse, getAngle, captureArrowKey} from "canvas2d/lib/util";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var context = canvas.getContext("2d");
var mouse = captureMouse($canvas);
var arrowPos = {
	x: 110,
	y: 110
};
var step = 3;
var vx = 0;
var vy = 0;
var num = 20;
var segments = [...Array(num)].map(()=>new Segment(300, 400, 50, 10));

function drag(seg, pos){
	seg.setRotation(getAngle(pos, seg.getXY()));
	var w = seg.getPin().x - seg.getX();
	var h = seg.getPin().y - seg.getY();
	seg.setXY(pos.x - w, pos.y - h);
}
function move(seg, i){
	if(i !== 0)
	{
		drag(segments[i], segments[i-1].getXY());
	}
}
function draw(seg){
	seg.draw(context);
}
drawAnimation(()=>{
	context.clearRect(0, 0, width, height);
	drag(segments[0], mouse);
	segments.forEach(move);
	segments.forEach(draw);
});