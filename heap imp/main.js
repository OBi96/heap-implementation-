/*
	- d3 display implementation of a treap based on the opendatastructes.org algorithms and Robin Ladiges dheap implementation.
*/

// global variables
var svg, svg2, inter, textChangeD, butChangeD, textInsert, butInsert, textRndD, time,
    textRndN, butRandom, rbMax, rbMin,speedSlider;

var arrtext;

var heap, tree;  
var d = 2;              
var w, h;
var clickmode = false;  


function init(){
	// gets the DOM elements. 
	svg = d3.select("#svg");
	svg2 = d3.select("#svg2");
	textChangeD = d3.select("#textChangeD");
	butChangeD = d3.select("#butChangeD");
	textInsert = d3.select("#textInsert");
	butInsert = d3.select("#butInsert");
	textRndD = d3.select("#textRndD");
	textRndN = d3.select("#textRndN");
	butRandom = d3.select("#butRandom");
	rbMax = d3.select("#rbMax");
	rbMin = d3.select("#rbMin");
	speedSlider = d3.select("#speedSlider");

	w = Number(svg.attr("width")) - 40;
	h = Number(svg.attr("height")) - 40;
	
	// Zoom function could be added 
  // svg = svg.call(d3.behavior.zoom().on("zoom", function () {svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")}));
	
	svg = svg.select("g");
	
	svg2 = svg2.call(d3.behavior.zoom().on("zoom", function () {svg2.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")})).select("g");
	
	// allows for the functions to run when enter is pressed.
	doClickOnEnter(textChangeD, butChangeD);
	doClickOnEnter(textInsert, butInsert);
	doClickOnEnter(textRndD, butRandom);
	doClickOnEnter(textRndN, butRandom);

	// selects either max heap or min heap.
	var clicker = function(){
		clickmode = Boolean(rbMax.property("checked"));
	};
	rbMax.on("click", clicker);
	rbMin.on("click", clicker);
	clickmode = Boolean(rbMax.property("checked"));


	tree = d3.layout.tree().size([w, h]);

	heap = new minDHeap(); 
	
	time = Math.floor(Math.pow(Number(speedSlider.property("value")),2));
	
	// sets up time pause element
	inter = setInterval(function(){
		doStep();
	}, time);
}


// changes the paused time.
function changeVal(){
	
	time = Math.floor(Math.pow(Number(speedSlider.property("value")),2));
	clearInterval(inter);
	//console.log(time);
    
	inter = setInterval(function(){
		doStep();
	}, time);
	
}

// changes the degree(# of children) of the heap.
function changeD(){
	var value = Number(textChangeD.property("value"));
	if( isNumber(value) ){
		if(value > 0){
			d = value;
			var arr = heap.array();
			if (clickmode){
				heap = new maxDHeap(d);
			}else{
				heap = new minDHeap(d);
			}
			for( var i = 0; i < arr.length; i++){
				heap.add(arr[i]);
				heap.skip();
			}
			update();
		}
	}
}

// change from max <----> min.
function changeHeap(){
	if (clickmode){
		var arr = heap.array();
		heap = new maxDHeap(heap.dim());
		for( var i = 0; i < arr.length; i++){
			if(isNumber(arr[i])){
				heap.add(arr[i]);
				heap.skip();
			}
		}
	}else{
		var arr = heap.array();
		heap = new minDHeap(heap.dim());
		for( var i = 0; i < arr.length; i++){
			if(isNumber(arr[i])){
				heap.add(arr[i]);
				heap.skip();
			}
		}
	}
	update();       
}

// add an element to the heap.
function doInsert(){
	var value = Number(textInsert.property("value"));
	if( isNumber(value) ){
		heap.add(value);
		update();
	}
}

// allows for a step to be done.
function doStep(){
	heap.step();
	update();
}


// remove top priority node
function removeTop(){
	if(heap.length() > 0){
		heap.remove();
	}
	update();
}

// makes a random treap of size n and degree d.
function randomHeap(d, n){
	if( isUndefined(d) ) d = Number(textRndD.property("value"));
	if( isUndefined(n) ) n = Number(textRndN.property("value"));
	if (clickmode){
		heap = maxDHeap.random(d, n);
	}else {
		heap = minDHeap.random(d, n);
	}
	update();
}


function update(){  
	redraw();
	// disables the buttons when the tree is changing.
	var onready = heap.ready() ? null : "disabled";
	var onbusy = heap.ready() ? "disabled" : null;
	textChangeD.attr("disabled", onready);
	butChangeD.attr("disabled", onready);
	textInsert.attr("disabled", onready);
	butInsert.attr("disabled", onready);
	
}

// draws the tree.
var redraw = function(){

	var heap2Object = function(){
		// sets up the tree one node at a time recursivily.
		var recursion = function(i){
			
			var name = ""+heap.get(i); 

			var cs = heap.children(i).map(recursion); 
			if(cs.length == 0) cs = undefined; 

			var fill = undefined;
			if (heap.i() == i) fill = "red";
			else if (heap.j() == i) fill = "green";
			else if (heap.k() && heap.k().indexOf(i) !== -1) fill = "lightblue";

			return {name: name, children: cs, fill: fill, index: i};
		};
		return function(){ return recursion(0) };
	}();

	// sets up the nodes and links to be drawn.
	return function(){
		
		svg.selectAll("line").remove();
		svg.selectAll("svg").remove();
		svg2.selectAll("text").remove();
		//str = "["
		/*for (var i =0; i<heap.length()-1;i++){
			str += heap.get(i)+ ", ";
		}
		if(heap.length()-1 > 0){
			str += heap.get(heap.length()-1);
		}
		str += "]";*/
		//svg2.append('text').text(str).attr('transform', 'translate(0,10)').style("font-size", "20px");
		svg2.append('text').text(JSON.stringify(heap.array()));
		if(heap.length() == 0) return;

		var treeData = heap2Object();
		var nodeData = tree.nodes(treeData);
		var linkData = tree.links(nodeData);

		
		var links = svg.selectAll("line")
			.data(linkData).enter().append("line")
			.attr("x1", function(d){return d.source.x})
			.attr("y1", function(d){return d.source.y})
			.attr("x2", function(d){return d.target.x})
			.attr("y2", function(d){return d.target.y});

		
		var nodes = svg.selectAll("svg")
			.data(nodeData).enter().append("svg")
			.attr("x", function(d){return d.x})
			.attr("y", function(d){return d.y})
			.each(makeSvgCircle);

	}; 
}();
