import $ from "jquery";
import {drawAnimation, angToRad} from "webgl/lib/util";
import Matrix4 from "webgl/lib/matrix/Matrix4";
import Vector3 from "webgl/lib/matrix/Vector3";
import Slider from "webgl/lib/slider";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/RouteObject.vert!text";
import FRAG_SHADER from "../shader/RouteObject.frag!text";
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
var lightXSlider = new Slider(50, 500, -1, 5, 0.0, "light x");
var lightYSlider = new Slider(100, 500, -1, 5, 3.0, "light y");
var lightZSlider = new Slider(150, 500, -1, 5, 4.0, "light z");
var pLightXSlider = new Slider(50, 650, -1, 5, 1.3, "p light x");
var pLightYSlider = new Slider(100, 650, -1, 5, -1.0, "p light y");
var pLightZSlider = new Slider(150, 650, -1, 5, -1.0, "p light z");
angleSlider.captureMouse($tools);
eyeXSlider.captureMouse($tools);
eyeYSlider.captureMouse($tools);
eyeZSlider.captureMouse($tools);
nearSlider.captureMouse($tools);
farSlider.captureMouse($tools);
lightXSlider.captureMouse($tools);
lightYSlider.captureMouse($tools);
lightZSlider.captureMouse($tools);
pLightXSlider.captureMouse($tools);
pLightYSlider.captureMouse($tools);
pLightZSlider.captureMouse($tools);
initShaders(gl, VERT_SHADER, FRAG_SHADER);

var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var a_Color = gl.getAttribLocation(gl.program, "a_Color");
var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");

var a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
var u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");
var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");

var u_PointLightColor = gl.getUniformLocation(gl.program, "u_PointLightColor");
var u_PointLightPosition = gl.getUniformLocation(gl.program, "u_PointLightPosition");


gl.uniform3f(u_PointLightColor, 1.0, 0.0, 1.0);// 设置点光源颜色
gl.uniform3f(u_LightColor, 1.0, 1.0, 0.0);// 设置光线颜色
gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);// 设置环境光颜色

  var vertices = new Float32Array([
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Colors
  var colors = new Float32Array([
    1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v1-v2-v3 front
    1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v3-v4-v5 right
    1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v5-v6-v1 up
    1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v1-v6-v7-v2 left
    1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,     // v7-v4-v3-v2 down
    1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1　    // v4-v7-v6-v5 back
 ]);

var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);
var normals = new Float32Array([    // 法向量
	0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
	1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
	0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
	-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
	0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
	0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
]);
var currenAngle = 0;
var mouseRouteAngle = [0, 0];
initMouseEvent();
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
initLocation(gl, {
	a_Position, 
	a_Color,
	a_Normal
});
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
	translation();
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}
function initLocation(gl, location){
	var vertexBuffer = gl.createBuffer();
	var colorBuffer = gl.createBuffer();
	var indexBuffer = gl.createBuffer();
	var normalBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location.a_Position, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location.a_Position);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location.a_Color, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location.a_Color);

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location.a_Normal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location.a_Normal);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
}
var modelMatrix = new Matrix4();
var mvpMatrix = new Matrix4();
var normalMatrix = new Matrix4();
function translation(){
	var lightDirection = new Vector3([lightXSlider.getValue(), lightYSlider.getValue(), lightZSlider.getValue()]);// 设置光线方向
	lightDirection.normalize();//归一化
	gl.uniform3fv(u_LightDirection, lightDirection.elements);// 设置平行光

	// var pointLightPosition = new Vector3([pLightXSlider.getValue(), pLightYSlider.getValue(), pLightZSlider.getValue()]);// 设置光线方向
	// pointLightPosition.normalize();//归一化
	gl.uniform3f(u_PointLightPosition, pLightXSlider.getValue(), pLightYSlider.getValue(), pLightZSlider.getValue());// 设置点光源位置

	modelMatrix.setTranslate(0, 0, 0);
	modelMatrix.rotate(currenAngle, 0, 0, 1);
	modelMatrix.rotate(mouseRouteAngle[0], 1, 0, 0);
	modelMatrix.rotate(mouseRouteAngle[1], 0, 1, 0);
	mvpMatrix.setPerspective(
		30.0, 1.0, 
		nearSlider.getValue(), farSlider.getValue()
	).lookAt(
		eyeXSlider.getValue(), eyeYSlider.getValue(), eyeZSlider.getValue(),
		0, 0, 0,
		0, 1, 0
	);
	mvpMatrix.multiply(modelMatrix);
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);// 设置法向量矩阵
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
	lightXSlider.draw(context);
	lightYSlider.draw(context);
	lightZSlider.draw(context);
	pLightXSlider.draw(context);
	pLightYSlider.draw(context);
	pLightZSlider.draw(context);
}
function initMouseEvent() {
	let dragging = false;
	var lastX = -1;
	var lastY = -1;
	$canvas.on("mousedown", null, function (event) {
		let x = event.clientX;
		let y = event.clientY;
		let rect = event.target.getBoundingClientRect();
		if( rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y )
		{
			lastX = x;
			lastY = y;
			dragging = true;
		}
	});
	$canvas.on("mouseup", null, function (event) {
		dragging = false;
	});
	$canvas.on("mousemove", null, function (event) {
		let x = event.clientX;
		let y = event.clientY;
		if( dragging )
		{
			let factor = 100 / height;
			let dx = factor * (x - lastX);
			let dy = factor * (y - lastY);
			mouseRouteAngle[0] = mouseRouteAngle[0] + dy;
			mouseRouteAngle[1] = mouseRouteAngle[1] + dx;
		}
		lastX = x;
		lastY = y;
	});
}