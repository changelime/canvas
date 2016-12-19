import Obj from "canvas2d/lib/object";
class Line extends Obj{
	constructor(x1, y1, x2, y2){
		super(0, 0);
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x2;
		this._y2 = y2;
	}
	getBounds(){
		if( this._rotation === 0 )
		{
			var minX = Math.min(this._x1, this._x2);
			var minY = Math.min(this._y1, this._y2);
			var maxX = Math.max(this._x1, this._x2);
			var maxY = Math.max(this._y1, this._y2);

			return {
				x : this._x + minX,
				y : this._y + minY,
				width : maxX - minX,
				height : maxY - minY
			};
		}
		else
		{
			var sin = Math.sin(this._rotation);
			var cos = Math.cos(this._rotation);
			var x1r = cos * this._x1 + sin * this._y1;
			var x2r = cos * this._x2 + sin * this._y2;
			var y1r = cos * this._y1 + sin * this._x1;
			var y2r = cos * this._y2 + sin * this._x2;
			
			return {
				x : this._x + Math.min(x1r, x2r),
				y : this._y + Math.min(y1r, y2r),
				width : Math.max(x1r, x2r) - Math.min(x1r, x2r),
				height : Math.max(y1r, y2r) - Math.min(y1r, y2r)
			};
		}
	}
	draw(context) {
		context.save();
		context.translate(this._x, this._y);
		context.rotate(this._rotation);
		context.scale(this._scaleX, this._scaleY);
		context.lineWidth = this._lineWidth;
		context.strokeStyle = this._color;
		context.beginPath();
		context.moveTo(this._x1, this._y1);
		context.lineTo(this._x2, this._y2);
		context.closePath();
		context.stroke();
		context.restore();
	}
}
export default Line;