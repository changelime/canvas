import Obj from "canvas2d/lib/object";

class Ship extends Obj{
	constructor (x, y){
		super( x, y);
		this.showFlame = false;
		this._rotation = -90;//util.radToAng(-90);
	}
	flame(){
		this.showFlame = true;
	}
	flameout(){
		this.showFlame = false;
	}
	draw(context) {
		context.save();
		context.translate(this._x, this._y);
		context.rotate(this._rotation);
		context.strokeStyle = this._color;
		context.beginPath();
		context.moveTo(10, 0);
		context.lineTo(-10, 10);
		context.lineTo(-5, 0);
		context.lineTo(-10, -10);
		context.lineTo(10, 0);
		context.stroke();
		if(this.showFlame)
		{
			context.beginPath();
			context.moveTo(-7.5, -5);
			context.lineTo(-15, 0);
			context.lineTo(-7.5, 5);
			context.stroke();
		}
		// context.closePath();
		context.restore();
	}
}

export default Ship;
