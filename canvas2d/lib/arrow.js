import Obj from "canvas2d/lib/object";

class Arrow extends Obj{
	constructor (x, y){
		super(x, y);
	}
	draw(context) {
		context.save();
		context.translate(this._x, this._y);
		context.rotate(this._rotation);
		context.lineWidth = 2;
		context.fillStyle = this._color;
		context.beginPath();
		context.moveTo(-50, -25);
		context.lineTo(0, -25);
		context.lineTo(0, -50);
		context.lineTo(50, 0);
		context.lineTo(0, 50);
		context.lineTo(0, 25);
		context.lineTo(-50, 25);
		context.lineTo(-50, -25);
		context.closePath();
		context.fill();
		context.stroke();
		context.restore();
	}
}
export default Arrow;	