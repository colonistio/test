var app = {
	//initial variables
	canvas  : null,
	context : null,

	//resizing
	width   : 800,
	height  : 400,

	//nodes
	nodes   : [],

	//timing
	timestamp  : 0,
	now        : 0,
	lastUpdate : 0,

	init : function(){
		this.canvas  = document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');
		this.resize();

		this.render();
		this.onInit();
	},
	render : function(){
		this.clear();
		this.update();

		window.addEventListener('resize', this.resize);
		window.requestAnimationFrame(this.render.bind(this));
	},
	clear  : function(){
		this.context.clearRect(0, 0, this.width*10, this.height*10);	// bigger space has to be cleared because resized content leave trails
	},
	resize : function(){

		this.canvas = document.querySelector('canvas');

		var canvasRatio = this.canvas.height / this.canvas.width;
		var windowRatio = window.innerHeight / window.innerWidth;

		if (windowRatio < canvasRatio) {
			this.height = window.innerHeight;
			this.width = this.height / canvasRatio;
		} else {
			this.width = window.innerWidth;
			this.height = this.width * canvasRatio;
		}

		this.canvas.style.width = this.width + 'px';
		this.canvas.style.height = this.height + 'px';
		this.clear();
		this.onResize();
    },
   	update : function(){
	    var dt = Date.now() - this.lastUpdate;

		this.onUpdate(dt);

		for(var index in this.nodes){
			var node = this.nodes[index];

			this.context.fillStyle = node.color;
			this.context.fillRect(node.x, node.y, node.width, node.height);
		}

		this.lastUpdate = Date.now();
		this.timestamp+=dt;
	},
	getNode : function(id){
		for(var index in this.nodes){
			var node = this.nodes[index];

			if(node.id == id){
				return node;
			}
		}

		return { x : null, y : null, width : null, height : null };
	},

	//events
	onInit   : function(){},
	onResize : function(){},
	onUpdate : function(){}
};

window.onload = function(){
	app.init();
};