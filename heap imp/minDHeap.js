//heap implementation
function minDHeap(d){
	if(isNaN(d)){
		d = 3;
	}      
	// init global values
	var arr = [];
	var size = arr.length;          
	var stepfunction = undefined;   

	function running(){return isDefined(stepfunction)};
	this.ready = function(){return !running();}
	this.length = function(){return size};
	this.array = function(){return arr.slice(0,size)}; //Array copy
	this.get = function(index){return arr[index]};
	this.dim = function(){return d};

	// used to play a single step at a time.
	this.step = function(){
		if(isDefined(stepfunction))
				stepfunction();
	};

	// used to skip steps.
	this.skip = function(){
		while(running())
				this.step();
	}

	// finds the index of parent.
	function parent(index){ return Math.ceil(index/d) - 1 };
	
	// returns all the children of a given node.
	function childs(index){ return d3.range(index * d + 1, (index+1)*d + 1).filter(function(i){return i < size}) };
	this.children = function(index){ return childs(index) };
	
	// returns the index of the min child.
	function minChild(cs){
		var min = cs[0];
		for(var i=1; i<cs.length; i++){
				if(arr[cs[i]] <= arr[min]) {
						min = cs[i];
				}
		}
		return min;
	}

	// keeps track of the nodes that needs to be coloured.
	var _i = undefined;
	var _j = undefined;
	var _k = undefined;
	this.i = function(){return _i};
	this.j = function(){return _j};
	this.k = function(){return _k};


	// inserts a new value to the heap(array)
	this.add = function(newVal){
		if(running()){ alert("Error: processing"); return; }
		if(isNaN(newVal)){ alert("Error: not a number"); return; }

		arr[size++] = newVal;

		bubbleUp(size-1);
		return true;
	};

	//bubbles up a index till its position is found.
	function bubbleUp(i){
		var p = parent(i); 
		//console.log('here1');
		if( i > 0 && arr[i] < arr[p] ){
			_i = i;
			_j = p;
			stepfunction = function(){
				//console.log('here2');
				arr.swap(i, p); 
				bubbleUp(p);    
			};
			return;
		}
		//console.log('here3');
		_i = undefined;
		_j = undefined;
		_k = undefined;
		
		stepfunction = undefined;
	}

	// removes the top element of the heap.
	this.remove = function(){
		var x = arr[0];
		if(running()){ alert("Error: processing"); return; }
		if( size < 0){ alert("Error: index out of range"); return;}

		var last = arr[size-1]; 
		arr[(size--)-1] = undefined; 

		arr[0] = last;
		trickleDown(0);
		return x;
	};

	// lets an element trickle down the heap untill a position is found.
	function trickleDown(i){
		var cs = childs(i); 

		if(cs.length != 0){ 
				var c = minChild(cs); 
				
				if(arr[c] < arr[i]){
						
						_i = i;
						_j = c;
						_k = cs;
						
						stepfunction = function(){
								arr.swap(i, c); 
								trickleDown(c);  
						}
						return;
				}
		}
		
		_i = undefined;
		_j = undefined;
		_k = undefined;
		
		stepfunction = undefined;
	}

 
}

// makes a random min heap
minDHeap.random = function(d, n){
	if( !isNumber(d) || d<1 ) d = rnd(1, 6);
	if( !isNumber(n) || n<1 ) n = rnd(1, 10);

	var h = new minDHeap(d);

	 for(var i = 0; i < n; i++){
			h.add(rnd(-n, +n));
			h.skip();
	}

	return h;
}
