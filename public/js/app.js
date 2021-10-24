var app = {
	//initial variables
	canvas  : null,
	context : null,

	//resizing
	width   : 800,
	height  : 400,

	//nodes
	nodes   : [],

	//Text to be drawn
	text   : [],

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
	update : function(){
	    var dt = Date.now() - this.lastUpdate;

		this.onUpdate(dt);

		for(var index in this.nodes){
			var node = this.nodes[index];

			this.context.fillStyle = node.color;
			if(node.shape == 'circle'){
				this.context.beginPath();
				this.context.arc(node.x, node.y , node.width ,0 ,2*Math.PI);
				this.context.fill();
			}
			else{
				this.context.fillRect(node.x, node.y, node.width, node.height);
			}
			
		}

		for(var index in this.text){
			var text = this.text[index];
			
			this.context.fillStyle = text.color;
			this.context.font = text.fontSize+" "+text.font;
			var texttobedisplayed=text.key+" "+text.value;
			this.context.fillText(texttobedisplayed,text.x,text.y);
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
	getText: function(id){
		for(var index in this.text){
			var displayedText = this.text[index];
			if(displayedText.id == id){
				
				return displayedText;
			}

		}
		return {x : null, y : null, color: null, value : null, key : null, fontSize : null, font : null};
	},

	//events
	onInit   : function(){},
	onUpdate : function(){},
	reset : function(){}
};

window.onload = function(){
	app.init();
};