import $ from "jquery";
import Node from "canvas2d/lib/node";
import Switcher from "canvas2d/lib/switcher";
import { drawAnimation, connectWithLine } from "canvas2d/lib/util";
import { randomHash } from "canvas2d/lib/color";
let $canvas = $("#canvas");
var img = $("#img");
var context = $canvas[0].getContext("2d");
var width = img.width();
var height = img.height();
$canvas.width(width).attr("width", width);
$canvas.height(height).attr("height", height);

context.drawImage(img[0], 0, 0, width, height);
var imagedata = context.getImageData(0, 0, width, height);
var data = imagedata.data;
for(var i = 0; i < data.length; i += 4)
{
	var r = data[i];
	var g = data[i+1];
	var b = data[i+2];
	var y = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
	data[i] = data[i+1] = data[i+2] = y;
	// data[i] = 255 - data[i];
	// data[i+1] = 255 - data[i+1];
	// data[i+2] = 255 - data[i+2];
}
context.putImageData(imagedata, 0, 0, 0, 0, width, height);
