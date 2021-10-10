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

	pause  : function(){
		this.onPause();
	},

	
	reset  : function(){
		this.onReset();
	},

	start  : function(){
		this.onStart();
	},

	update : function(){
	    var dt = Date.now() - this.lastUpdate;

		this.onUpdate(dt);

		for(var index in this.nodes){
			
			var node = this.nodes[index];

			if(node.type == "square"){
					this.context.fillStyle = node.color;
					this.context.fillRect(node.x, node.y, node.width, node.height);
				
			}else if(node.type == "text"){
					this.context.font = node.font;
					this.context.fillStyle = node.color;
					this.context.fillText(node.input, node.x, node.y);
					this.context.textAlign = node.align;
					
			}else if(node.type == "round"){
			
					this.context.beginPath();
					this.context.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, false);
					this.context.fillStyle = node.color;
					this.context.fill();
				
			
			}else if(node.type == "line"){
				this.context.beginPath();
				this.context.setLineDash([25, 25]);
				this.context.moveTo(node.x, 50);
				this.context.lineTo(node.x, node.y);
				this.context.stroke();
			}
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
	onUpdate : function(){},
	onPause : function(){},
	onReset : function(){},
	onStart : function(){}
};

window.onload = function(){
	app.init();
};