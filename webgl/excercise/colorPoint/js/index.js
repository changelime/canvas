import $ from "jquery";
import {drawAnimation} from "webgl/lib/util";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/colorPoint.vert!text";
import FRAG_SHADER from "../shader/colorPoint.frag!text";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var gl = canvas.getContext("webgl");
initShaders(gl, VERT_SHADER, FRAG_SHADER);
var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

var points = [];
$canvas.on("mousemove", null, function(event){
	var point = {
		x: (event.offsetX - (width / 2)) / (width / 2),
		y: ((height / 2) - event.offsetY) / (height / 2),
	};
	if( point.x >= 0.0 && point.y >= 0.0 )
	{
		point.color = [1.0, 0.0, 0.0, 1.0];
	}
	else if( point.x < 0.0 && point.y < 0.0 )
	{
		point.color = [0.0, 1.0, 0.0, 1.0];
	}
	else
	{
		point.color = [1.0, 1.0, 1.0, 1.0];
	}
	points.push(point);
});

gl.vertexAttrib1f(a_PointSize, 10.0);
drawAnimation(()=>{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	points.forEach((point)=>{
		gl.vertexAttrib3f(a_Position, point.x, point.y, 0.0);
		gl.uniform4f(u_FragColor, point.color[0], point.color[1], point.color[2], point.color[3]);
		gl.drawArrays(gl.POINTS, 0, 1);
	});
});