import $ from "jquery";
import {drawAnimation, angToRad} from "webgl/lib/util";
import Matrix4 from "webgl/lib/matrix/Matrix4";
import Slider from "webgl/lib/slider";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/helloCubes.vert!text";
import FRAG_SHADER from "../shader/helloCubes.frag!text";
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
var eyeXSlider = new Slider(50, 200, -1, 7, 3, "eye x");
var eyeYSlider = new Slider(100, 200, -1, 7, 3, "eye y");
var eyeZSlider = new Slider(150, 200, -1, 7, 7, "eye z");
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
var points = new Float32Array([
	//顶点坐标，       颜色
	 1.0,  1.0,  1.0, 0.0, 1.0, 1.0, //v0,
	-1.0,  1.0,  1.0, 1.0, 0.0, 1.0, //v1,
	-1.0, -1.0,  1.0, 1.0, 1.0, 0.0, //v2,
	 1.0, -1.0,  1.0, 1.0, 0.0, 0.0, //v3,
 	 1.0, -1.0, -1.0, 0.0, 1.0, 0.0, //v4,
	 1.0,  1.0, -1.0, 0.0, 0.0, 1.0, //v5,
	-1.0,  1.0, -1.0, 1.0, 1.0, 1.0, //v6,
	-1.0, -1.0, -1.0, 0.0, 0.0, 0.0  //v7,
]);
var indices = new Uint8Array([
	0, 1, 2, 0, 2, 3,
	0, 3, 4, 0, 4, 5,
	0, 5, 6, 0, 6, 1,
	1, 6, 7, 1, 7, 2,
	7, 4, 3, 7, 3, 2,
	4, 7, 6, 4, 6, 5
]);
var perPonitCount = 6;
var xformMatrix = new Matrix4();
var currenAngle = 0;

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
initLocation(gl, points, {
	a_Position, 
	a_Color
}, perPonitCount);
drawAnimation(()=>{
	animate();
	drawWebgl();
	draw2d();
});
function drawWebgl(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	draw();
}
function draw(){
	translation(xformMatrix, u_ModelMatrix);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}
function initLocation(gl, vertices, location, perPonitCount){
	var vertexBuffer = gl.createBuffer();
	var indexBuffer = gl.createBuffer();
	var FSIZE = vertices.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location.a_Position, 3, gl.FLOAT, false, FSIZE * perPonitCount, 0);
	gl.enableVertexAttribArray(location.a_Position);
	gl.vertexAttribPointer(location.a_Color, 3, gl.FLOAT, false, FSIZE * perPonitCount, FSIZE * 3);
	gl.enableVertexAttribArray(location.a_Color);
	
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

}

function translation(xformMatrix, u_ModelMatrix){
	xformMatrix.setPerspective(
		30.0, 1.0, 
		nearSlider.getValue(), farSlider.getValue()
	).lookAt(
		eyeXSlider.getValue(), eyeYSlider.getValue(), eyeZSlider.getValue(),
		0, 0, 0,
		0, 1, 0
	).rotate(currenAngle, 0, 0, 1);
	gl.uniformMatrix4fv(u_ModelMatrix, false, xformMatrix.elements);
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