import $ from "jquery";
import {drawAnimation} from "webgl/lib/util";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/multiPoint.vert!text";
import FRAG_SHADER from "../shader/multiPoint.frag!text";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var gl = canvas.getContext("webgl");
initShaders(gl, VERT_SHADER, FRAG_SHADER);

var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var points = [-1, -1];
$canvas.on("mousemove", null, function(event){
	var point = {
		x: (event.offsetX - (width / 2)) / (width / 2),
		y: ((height / 2) - event.offsetY) / (height / 2),
	};
	points.push(point.x, point.y);
});

gl.vertexAttrib1f(a_PointSize, 10.0);
gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
drawAnimation(()=>{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	var n = initVertexBuffers(gl, new Float32Array(points), a_Position, points.length / 2);
	gl.drawArrays(gl.POINTS, 0, n);
});
function initVertexBuffers(gl, vertices, location, n){
	var vertexBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location);
	return n;
}