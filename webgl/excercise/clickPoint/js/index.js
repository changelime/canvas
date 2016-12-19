import $ from "jquery";
import {drawAnimation} from "webgl/lib/util";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/clickPoint.vert!text";
import FRAG_SHADER from "../shader/clickPoint.frag!text";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var gl = canvas.getContext("webgl");
initShaders(gl, VERT_SHADER, FRAG_SHADER);
var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
var points = [];
$canvas.on("mousedown", null, function(event){
	points.push({
		x: (event.offsetX - (width / 2)) / (width / 2),
		y: ((height / 2) - event.offsetY) / (height / 2)
	});
});

gl.vertexAttrib1f(a_PointSize, 10.0);
drawAnimation(()=>{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	points.forEach((item)=>{
		gl.vertexAttrib3f(a_Position, item.x, item.y, 0.0);
		gl.drawArrays(gl.POINTS, 0, 1);
	});
});