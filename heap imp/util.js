// function returns random value between min and max
function rnd(min, max){
	if(isNaN(min)) min = 0;
	if(isNaN(max)) max = 10;
	if(max > min){
		var tmp = min;
		min = max;
		max = tmp;
	}
	return Math.floor(Math.random()*(max-min+1)) + min;
}

function isArray(a) { return a instanceof Array }
function isFunction(f) { return f instanceof Function }
function isNumber(x){ return !isNaN(x) }

function isDefined(x){ return x !== undefined }
function isUndefined(x){ return !isDefined(x) }

// swaps elements in an array.
Array.prototype.swap = function(a, b){
	var arr = this.valueOf();
	var tmp = arr[a];
	arr[a] = arr[b];
	arr[b] = tmp;
}

// allows for functions to be called when enter is pressed.
function doClickOnEnter(text, button){
	text.on("keypress", function(){
		// if enter is pressed.
		if(d3.event.keyCode == 13){ 
			var click = button.node().onclick;
			if(isFunction(click)){
				click();
			}	else{
				console.warn("not a function");
			}
		}
	});
}

// build the svg circles.
function makeSvgCircle(data, index){
	var self = d3.select(this);

	var text = self.append("text")
									.attr("x", 0).attr("y",0)
									.text(data.name);

	var box = text.node().getBBox();

	var circle = self.insert("circle", ":first-child")
										.attr("stroke", "black")
										.attr("fill", data.fill ? data.fill : "white")
										.attr("cx", 0).attr("cy", 0)
										.attr("r", Math.sqrt(box.width*box.width + box.height*box.height)/2 + 2)
										.style("cursor","pointer");

}