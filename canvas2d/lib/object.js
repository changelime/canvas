class Obj{
	constructor(x, y, width, height){
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
		this._color = "#ffff00";
		this._scaleX = 1;
		this._scaleY = 1;
		this._lineWidth = 1;
		this._rotation = 0;
		this._vx = 0;
		this._vy = 0;
	}
	setVxVy(vx, vy){
		this._vx = vx;
		this._vy = vy;
	}
	setVx(vx){
		this._vx = vx;
	}
	setVy(vy){
		this._vy = vy;
	}
	getVxVy(){
		return {
			vx: this._vx,
			vy: this._vy
		}
	}
	getVx(){
		return this._vx;
	}
	getVy(){
		return this._vy;
	}
	getHeight(){
		return this._height;
	}
	getWidth(){
		return this._width;
	}
	getBounds(){
		return {
			x : this._x,
			y : this._y,
			width : this._width,
			height : this._height
		};
	}
	setColor(color) {
		this._color = color;
	}
	setRotation(r){
		this._rotation = r;
	}
	getRotation(){
		return this._rotation;
	}
	scaleY(scaleY){
		this._scaleY = scaleY;
	}
	scaleX(scaleX){
		this._scaleX = scaleX;
	}
	setY(y, self){
		if(self)
		{
			this._y += y;
		}
		else
		{
			this._y = y;
		}
	}
	setX(x, self){
		if(self)
		{
			this._x += x;
		}
		else
		{
			this._x = x;
		}
	}
	setXY(x, y){
		this._x = x;
		this._y = y;
	}
	getY(){
		return this._y;
	}
	getX(){
		return this._x;
	}
	getXY(){
		return {
			x : this._x,
			y : this._y
		};
	}
}

export default Obj;