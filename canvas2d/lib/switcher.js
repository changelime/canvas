import Obj from "canvas2d/lib/object";
import {captureMouse, containsPoint} from "canvas2d/lib/util";
class Switcher extends Obj{
	constructor(x, y, items, text){
		super(x, y, 100, 40);
		this._items = items;
		// this._value = items[0].value;
		this._selected = 0;
		this.boxColor = "pink";
		this.borderColor = "white";
		this._text = text;
	}
	
	draw(context) {
		let lineTo = function(context, start, end, color){
			context.save();
			context.strokeStyle = color ? color : "white";
			context.beginPath();
			context.moveTo(start.x, start.y);
			context.lineTo(end.x, end.y);
			context.stroke();
			context.closePath();
			context.restore();
		};
		let pointer = function(context, start, color){
			let h = 10;
			let w = 10;
			context.save();
			context.strokeStyle = color ? color : "white";
			context.beginPath();
			context.moveTo(start.x, start.y - h);
			context.lineTo(start.x + w / 2, start.y);
			context.lineTo(start.x - w / 2, start.y);
			context.closePath();
			// context.lineTo(start.x, start.y - h);
			context.stroke();
			context.restore();
		};
		let text = function(context, text, itemName, x, y){
			context.save();
			context.fillStyle = "white";
			context.font="14px yahei"; 
			context.textAlign = "center";
			context.fillText(`${text}: ${itemName}`, x, y);
			context.restore();
		};
		context.save();
		context.translate(this._x, this._y);
		context.rotate(this._rotation);
		context.scale(this._scaleX, this._scaleY);
		context.lineWidth = this._lineWidth;
		//box
		context.strokeStyle = this.boxColor;
		context.beginPath();
		context.rect(0, 0, this._width, this._height);
		context.closePath();
		context.stroke();
		//col
		let items = this._items;
		let colWidth = this._width / items.length;
		for( let i = 1; i < items.length; i++ )
		{
			let x = (colWidth * i);
			lineTo(context, {
				x: x,
				y: 0
			}, {
				x: x,
				y: this._height
			});
		}
		for( let i = 0; i < items.length; i++ )
		{
			let x = (colWidth * i) + colWidth / 2;
			let item = items[i];
			if( item.value === items[this._selected].value )
			{
				pointer(context, {
					x: x,
					y: this._height
				});
			}
		}
		text(context, this._text, items[this._selected].name, this._width / 2, this._height + 20);
		context.restore();
	}
	getValue(){
		return this._items[this._selected].value;
	}
	captureMouse($el){
		var mouse = captureMouse($el);
		var bounds = this.getBounds();
		let self = this;
		$el.on("click", null, function(event){
			if(containsPoint(bounds, mouse.x, mouse.y))
			{
				self._selected = (++self._selected) % self._items.length;
			}
		});
	}
}
export default Switcher;