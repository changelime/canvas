import $ from "jquery";
import {drawAnimation, angToRad} from "webgl/lib/util";
import Matrix4 from "webgl/lib/matrix/Matrix4";
import Slider from "webgl/lib/slider";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/perspectiveview.vert!text";
import FRAG_SHADER from "../shader/perspectiveview.frag!text";
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
var eyeXSlider = new Slider(50, 200, -1, 1, 0, "eye x");
var eyeYSlider = new Slider(100, 200, -1, 1, 0, "eye y");
var eyeZSlider = new Slider(150, 200, -1, 5, 5, "eye z");
var nearSlider = new Slider(50, 350, 1, 100, 1.0, "near");
var farSlider = new Slider(100, 350, 2, 100, 100, "far");
angleSlider.captureMouse($tools);
eyeXSlider.captureMouse($tools);
eyeYSlider.captureMouse($tools);
eyeZSlider.captureMouse($tools);
nearSlider.captureMouse($tools);
farSlider.captureMouse($tools);
initShaders(gl, VERT_SHADER, FRAG_SHADER);

var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var a_Color = gl.getAttribLocation(gl.program, "a_Color");
var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
var points = [
	//顶点坐标，       颜色
	0.0,  1.0,  0.0, 0.4, 0.4, 1.0, 
	-0.5, -1.0,  0.0, 0.4, 0.4, 1.0, 
	 0.5, -1.0,  0.0, 1.0, 0.4, 0.4, 


	 

	 0.0,  1.0, -2.0, 1.0, 0.4, 0.4, 
	-0.5, -1.0, -2.0, 1.0, 1.0, 0.4, 
	 0.5, -1.0, -2.0, 1.0, 1.0, 0.4, 

	 0.0,  1.0, -4.0, 0.4, 1.0, 0.4, 
	-0.5, -1.0, -4.0, 0.4, 1.0, 0.4, 
	 0.5, -1.0, -4.0, 1.0, 0.4, 0.4, 

	 
];
var perPonitCount = 6;
var xformMatrix = new Matrix4();
var currenAngle = 0;

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
drawAnimation(()=>{
	animate();
	drawWebgl();
	draw2d();
});
function drawWebgl(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// gl.clear(gl.COLOR_BUFFER_BIT);
	draw();
}
function draw(){
	translation();
	// initTextures();
	initLocation(gl, new Float32Array(points), {
		a_Position, 
		a_Color,
		u_ModelMatrix
	}, perPonitCount);
	gl.drawArrays(gl.TRIANGLES, 0, points.length / perPonitCount);
	xformMatrix.translate(-0.75 * 2, 0, 0);
	gl.uniformMatrix4fv(u_ModelMatrix, false, xformMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, points.length / perPonitCount);
}
function initLocation(gl, vertices, location, perPonitCount){
	var vertexBuffer = gl.createBuffer();
	var FSIZE = vertices.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location.a_Position, 3, gl.FLOAT, false, FSIZE * perPonitCount, 0);
	gl.enableVertexAttribArray(location.a_Position);
	gl.vertexAttribPointer(location.a_Color, 3, gl.FLOAT, false, FSIZE * perPonitCount, FSIZE * 3);
	gl.enableVertexAttribArray(location.a_Color);
	gl.uniformMatrix4fv(location.u_ModelMatrix, false, xformMatrix.elements);
	
}

function translation(){
	xformMatrix.setPerspective(
		30.0, 1.0, 
		nearSlider.getValue(), farSlider.getValue()
	).lookAt(
		eyeXSlider.getValue(), eyeYSlider.getValue(), eyeZSlider.getValue(),
		0, 0, -100,
		0, 1, 0,
	).rotate(currenAngle, 0, 0, 1).translate(0.75, 0, 0);
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
	eyeXSlider.draw(context);
	eyeYSlider.draw(context);
	eyeZSlider.draw(context);
	nearSlider.draw(context);
	farSlider.draw(context);
}