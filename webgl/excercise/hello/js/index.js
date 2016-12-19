import $ from "jquery";
import {drawAnimation} from "webgl/lib/util";
import {initShaders} from "webgl/lib/cuon-utils";
import VERT_SHADER from "../shader/hello.vert!text";
import FRAG_SHADER from "../shader/hello.frag!text";
var $canvas = $("#canvas");
var canvas = $canvas[0];
var width = $canvas.width();
var height = $canvas.height();
var gl = canvas.getContext("webgl");
initShaders(gl, VERT_SHADER, FRAG_SHADER);
drawAnimation(()=>{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, 1);
});