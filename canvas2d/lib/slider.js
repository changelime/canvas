import Obj from "canvas2d/lib/object";
import {captureMouse, containsPoint} from "canvas2d/lib/util";
class Slider extends Obj{
	constructor(x, y, min = 0, max = 100, value = 50, text = ""){
		super(x, y, 16, 100);
		this._min = min;
		this._max = max;
		this._value = value;
		this._text = text;
		this.onchange = null;
		this.backColor = "pink";
		this.backBorderColor = "#999999";
		this.backWidth = 4;
		this.backX = this._width / 2 - this.backWidth / 2;
		this.handleColor = "black";
		this.handleBorderColor = "pink";
		this.handleHeight = 6;
		this.handleY = 0;
		this.updatePosition();
	}
	draw(context) {
		context.save();
		context.translate(this._x, this._y);
		context.rotate(this._rotation);
		context.scale(this._scaleX, this._scaleY);
		context.lineWidth = this._lineWidth;
		//range
		context.fillStyle = this.backColor;
		context.beginPath();
		context.fillRect(this.backX, 0, this.backWidth, this._height);
		context.closePath();
		//handle
		context.strokeStyle = this.handleBorderColor;
		context.fillStyle = this.handleColor;
		context.beginPath();
		context.rect(0, this.handleY, this._width, this.handleHeight);
		context.closePath();
		context.font="14px yahei"; 
		context.textAlign = "center";
		context.fillText(this._text, this.backX, this._height + 14);
		context.fillText(this._value.toFixed(2), this.backX, -14);
		context.fill();
		context.stroke();
		context.restore();
	}
	getValue(){
		return this._value;
	}
	setValue(value){
		return this._value = value;
	}
	updateValue(){
		var oldValue = this.value;
		var handleRange = this._height - this.handleHeight;
		var range = this._max - this._min;
	
		this._value = (handleRange - this.handleY) / handleRange * range + this._min;
		if( typeof this.onchange === "function" && this._value !== oldValue )
		{
			this.onchange();
		}
	}
	updatePosition(){
		var handleRange = this._height - this.handleHeight;
		var range = this._max - this._min;

		this.handleY = handleRange - ((this._value - this._min) / range) * handleRange;
	}
	captureMouse($el){
		var mouse = captureMouse($el);
		var bounds = {};
		var self = this;
		setHandleBounds();
		function setHandleBounds(){
			bounds.x = self._x;
			bounds.y = self._y + self.handleY;
			bounds.width = self._width;
			bounds.height = self.handleHeight;
		}
		function onMouseUp(){
			$el.off("mousemove", onMouseMove);
			$el.off("mouseup", onMouseUp);
			setHandleBounds();
		}
		function onMouseMove(){
			var pos_y = mouse.y - self._y;
			self.handleY = Math.min(self._height - self.handleHeight, Math.max(pos_y, 0));
			self.updateValue();	
		}
		$el.on("mousedown", null, function(event){
			if(containsPoint(bounds, mouse.x, mouse.y))
			{
				$el.on("mouseup", null, onMouseUp);
				$el.on("mousemove", null, onMouseMove);
			}
		});

	}
}
export default Slider;