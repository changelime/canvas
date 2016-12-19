import Obj from "canvas2d/lib/object";
class Segment extends Obj{
	constructor(x, y, width, height){
		super(x, y, width, height);
		
	}
	draw(context) {
		var h = this._height;
		var d = this._width + h;
		var cr = h / 2;
		context.save();
		context.translate(this._x, this._y);
		context.rotate(this._rotation);
		context.scale(this._scaleX, this._scaleY);
		context.lineWidth = this._lineWidth;
		context.strokeStyle = this._color;
		context.beginPath();

		context.moveTo(0, -cr);
		context.lineTo(d - (2 * cr), -cr);
		context.quadraticCurveTo(-cr + d, -cr, -cr + d, 0);
		
		context.lineTo(-cr + d, h - (2 * cr));
		context.quadraticCurveTo(-cr + d, -cr + h, d - (2 * cr), -cr + h);

		context.lineTo(0, -cr + h);
		context.quadraticCurveTo(-cr, -cr + h, -cr, h - (2 * cr));
		
		context.lineTo(-cr, 0);
		context.quadraticCurveTo(-cr, -cr, 0, -cr);
		
		context.closePath();
		context.stroke();
		//2 pins
		context.beginPath();
		context.strokeStyle = "pink";
		context.arc(0, 0, 4, 0, (Math.PI * 2), true);
		context.closePath();
		context.stroke();
		context.beginPath();
		context.strokeStyle = "green";
		context.arc(this._width, 0, 4, 0, (Math.PI * 2), true);
		context.closePath();
		context.stroke();
		
		context.restore();
	}
	getPin(){
		return {
			x: this._x + Math.cos(this._rotation) * this._width,
			y: this._y + Math.sin(this._rotation) * this._width
		};
	}
}
export default Segment;