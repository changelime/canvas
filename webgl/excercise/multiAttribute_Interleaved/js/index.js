import $ from "jquery";
import {drawAnimation, angToRad} from "webgl/lib/util";
import Matrix4 from "webgl/lib/matrix/Matrix4";
import Slider from "webgl/lib/slider";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/multiAttribute_Interleaved.vert!text";
import FRAG_SHADER from "../shader/multiAttribute_Interleaved.frag!text";
var $canvas = $("#canvas");
var $tools = $("#tools");
var toolsWidth = $tools.width();
var toolsHeight = $tools.height();
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var gl = canvas.getContext("webgl");
var context = $tools[0].getContext("2d");
var angleSlider = new Slider(100, 50, -360, 360, 0, "angle");
var posXSlider = new Slider(100, 200, -1, 1, 0, "pos x");
var posYSlider = new Slider(100, 350, -1, 1, 0, "pos y");
var posZSlider = new Slider(100, 500, -1, 1, 0, "pos z");
angleSlider.captureMouse($tools);
posXSlider.captureMouse($tools);
posYSlider.captureMouse($tools);
posZSlider.captureMouse($tools);
initShaders(gl, VERT_SHADER, FRAG_SHADER);

var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");

var points = [
	0, 0.5, 10.0,
	-0.5, -0.5, 20.0,
	0.5, -0.5, 30.0,
	-0.5, 0.5, 40.0
];
var perPonitCount = 3;
var xformMatrix = new Matrix4();
gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
var currenAngle = 0;

function drawWebgl(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	xformMatrix.setRotate(currenAngle, 0, 0, 1);
	xformMatrix.translate(posXSlider.getValue(), posYSlider.getValue(), posZSlider.getValue());
	gl.uniformMatrix4fv(u_ModelMatrix, false, xformMatrix.elements);
	initVertexBuffers(gl, new Float32Array(points), {a_Position, a_PointSize}, perPonitCount);
	gl.drawArrays(gl.POINTS, 0, points.length / perPonitCount);
}
function animate(){
	var now = Date.now();
	var elapsed = now - (animate.last ? animate.last : 0);
	animate.last = now;
	var newAngle = currenAngle + (angleSlider.getValue() * elapsed) / 1000.0;
	currenAngle = newAngle % 360;
}
function draw2d(){
	context.clearRect(0, 0, toolsWidth, toolsHeight);
	angleSlider.draw(context);
	posXSlider.draw(context);
	posYSlider.draw(context);
	posZSlider.draw(context);
}
drawAnimation(()=>{
	animate();
	drawWebgl();
	draw2d();
});
function initVertexBuffers(gl, vertices, location, perPonitCount){
	var vertexBuffer = gl.createBuffer();
	var FSIZE = vertices.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location.a_Position, 2, gl.FLOAT, false, FSIZE * perPonitCount, 0);
	gl.enableVertexAttribArray(location.a_Position);
	gl.vertexAttribPointer(location.a_PointSize, 1, gl.FLOAT, false, FSIZE * perPonitCount, FSIZE * 2);
	gl.enableVertexAttribArray(location.a_PointSize);
}