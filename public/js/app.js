var app = {
	//initial variables
	canvas: null,
	context: null,

	// id of the animation frame, needed if window resizes
	request_id: null,

	//resizing
	width: 800,
	height: 400,

	//nodes
	nodes: [],

	//timing
	timestamp: 0,
	now: 0,
	lastUpdate: 0,

	init: function () {
		// reset the variables in case starting again
		window.cancelAnimationFrame(this.request_id);
		this.nodes = [];
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.timestamp = 0;
		this.now = 0;
		this.lastUpdate = 0;

		// set the canvas object and make it the height and width of the screen
		this.canvas = document.getElementById("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		// make the 2d context for the canvas
		this.context = this.canvas.getContext("2d");

		// start the animating
		this.render();

		// initialize the variables needed for the animation
		this.onInit();
	},
	render: function () {
		this.clear();
		this.update();

		// get the animation request in case we need to cancel animation
		this.request_id = window.requestAnimationFrame(this.render.bind(this));
	},
	clear: function () {
		this.context.clearRect(0, 0, this.width, this.height);
	},
	update: function () {
		var dt = Date.now() - this.lastUpdate;

		this.onUpdate(dt);

		for (var index in this.nodes) {
			var node = this.nodes[index];

			this.context.fillStyle = node.color;
			this.context.fillRect(node.x, node.y, node.width, node.height);
		}

		this.lastUpdate = Date.now();
		this.timestamp += dt;
	},
	getNode: function (id) {
		for (var index in this.nodes) {
			var node = this.nodes[index];

			if (node.id == id) {
				return node;
			}
		}

		return { x: null, y: null, width: null, height: null };
	},

	//events
	onInit: function () {},
	onUpdate: function () {},
};

window.onload = function () {
	app.init();
};
