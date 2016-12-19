import $ from "jquery";
import {drawAnimation, angToRad} from "webgl/lib/util";
import Matrix4 from "webgl/lib/matrix/Matrix4";
import Slider from "webgl/lib/slider";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/routatedTriangle_Matrix4.vert!text";
import FRAG_SHADER from "../shader/routatedTriangle_Matrix4.frag!text";
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
angleSlider.captureMouse($tools);

initShaders(gl, VERT_SHADER, FRAG_SHADER);

var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
var a_Position = gl.getAttribLocation(gl.program, "a_Position");
var u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");

var points = [
	0, 0.5,
	-0.5, -0.5,
	0.5, -0.5
];
var xformMatrix = new Matrix4();
gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
drawAnimation(()=>{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	context.clearRect(0, 0, toolsWidth, toolsHeight);
	xformMatrix.setRotate(angleSlider.getValue(), 0, 0, 1);
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
	var n = initVertexBuffers(gl, new Float32Array(points), a_Position, points.length / 2);
	gl.drawArrays(gl.TRIANGLES, 0, n);
	angleSlider.draw(context);
});
function initVertexBuffers(gl, vertices, location, n){
	var vertexBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(location);
	return n;
}