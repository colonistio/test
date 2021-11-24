var app = {
	//initial variables
	canvas  : null,
	context : null,

	//resizing
	width   : 800,
	height  : 400,

	//nodes
	nodes   : [],
	textNodes : [],

	//timing
	timestamp  : 0,
	now        : 0,
	lastUpdate : 0,
	//other vars
	paused : false,
	dunking : false,
	dunkNext : false,
	p1Score : 0,
	p2Score : 0,

	init : function(){
		this.canvas  = document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');

		this.render();
		this.onInit();
	},
	render : function(){
		this.clear();
		this.update();

		window.requestAnimationFrame(this.render.bind(this));
	},
	clear  : function(){
		this.context.clearRect(0, 0, this.width, this.height);
	},
	update : function(){
		if (!app.paused){ //do nothing
			this.onUpdate(dt);
		}
	    var dt = Date.now() - this.lastUpdate;


		for(var index in this.nodes){
			var node = this.nodes[index];

			this.context.fillStyle = node.color;
			this.context.fillRect(node.x, node.y, node.width, node.height);
		}
		//Text nodes
		function renderText(node){
			app.context.font = '40px arial';
			app.context.fillStyle = 'white';
			app.context.fillText(node.text,node.x,node.y);
		}
		this.textNodes.forEach(renderText);

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
	onUpdate : function(){},
	
	reset : function(){		
		this.nodes = [];
		this.textNodes = [];
		this.onInit();
	},
	togglePause : function(){
		this.paused = !this.paused;
	},
};

window.onload = function(){
	app.init();
};