import $ from "jquery";
import {drawAnimation, angToRad} from "webgl/lib/util";
import Matrix4 from "webgl/lib/matrix/Matrix4";
import Slider from "webgl/lib/slider";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/MultiTexture.vert!text";
import FRAG_SHADER from "../shader/MultiTexture.frag!text";
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

var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
var u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
var u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
var points = [
	//顶点坐标， 纹理坐标
	-0.5,  0.5, 0.0, 1.0,
	-0.5, -0.5, 0.0, 0.0,
	 0.5,  0.5, 1.0, 1.0,
	 0.5, -0.5, 1.0, 0.0
];
var perPonitCount = 4;
var xformMatrix = new Matrix4();
var currenAngle = 0;
var imgLoad = false;
Promise.all([
	loadImg("../../resources/sky.jpg"),
	loadImg("../../resources/circle.gif")
]).then((imgs)=>{
	initTextures(gl.TEXTURE0, u_Sampler0, imgs[0], 0);
	initTextures(gl.TEXTURE1, u_Sampler1, imgs[1], 1);
	imgLoad = true;
});
;
gl.clearColor(0.0, 0.0, 0.0, 1.0);
drawAnimation(()=>{
	animate();
	drawWebgl();
	draw2d();
});
function drawWebgl(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	if(imgLoad)
	{
		draw();
	}
}
function draw(){
	translation();
	// initTextures();
	initLocation(gl, new Float32Array(points), {
		a_Position, 
		a_TexCoord,
		u_ModelMatrix
	}, perPonitCount);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length / perPonitCount);
}
function initLocation(gl, vertices, location, perPonitCount){
	var vertexBuffer = gl.createBuffer();
	var FSIZE = vertices.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location.a_Position, 2, gl.FLOAT, false, FSIZE * perPonitCount, 0);
	gl.enableVertexAttribArray(location.a_Position);
	gl.vertexAttribPointer(location.a_TexCoord, 2, gl.FLOAT, false, FSIZE * perPonitCount, FSIZE * 2);
	gl.enableVertexAttribArray(location.a_TexCoord);
	gl.uniformMatrix4fv(location.u_ModelMatrix, false, xformMatrix.elements);
	
}

function loadImg(src){
	return new Promise((resolve, reject)=>{
		var image = new Image();
		image.onload = function(){
			resolve(image);
		};
		image.src = src;
	});
}
window.loadImg = loadImg;
function initTextures(textureNum, sampler, image, unit){
	var texTure = gl.createTexture();
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(textureNum);
	gl.bindTexture(gl.TEXTURE_2D, texTure);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(sampler, unit);
}

function translation(){
	xformMatrix.setRotate(currenAngle, 0, 0, 1);
	xformMatrix.translate(posXSlider.getValue(), posYSlider.getValue(), posZSlider.getValue());
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