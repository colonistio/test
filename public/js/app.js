// game state
const GAME_STATE = {
	PAUSE: 'pause',
	RUNNING: 'running',
	SCORED: 'scored',
	RE_START: 're-start'
}

// detect collisions
function collisionDetect(player, ball) {
	let collidesX = false;
	let collidesY = ball.y >= player.y && ball.y <= player.y + player.height;
	if (ball.movement.direction.x === 1) {
		collidesX = player.x < (ball.x + ball.radius);
	} else if (ball.movement.direction.x === -1) {
		collidesX = (player.x + player.width) >= (ball.x - ball.radius);
	}
	return collidesX && collidesY;
}

// window keyup bind event handler
function bindKeyup(e) {
	for (var index in app.nodes) {
		if (typeof app.nodes[index].keyupControls === 'function') {
			// if handler exists on the entity call the handler
			app.nodes[index].keyupControls(e);
		}
	}
}

// window keyup bind event handler
function bindKeyDown(e) {
	e.preventDefault();
	for (var index in app.nodes) {
		if (typeof app.nodes[index].keydownControls === 'function') {
			// if handler exists on the entity call the handler
			app.nodes[index].keydownControls(e);
		}
	}
	if (e.keycode === 32 || e.which == 32) {
		// space
		app.pause();
	} else if (e.keycode === 27 || e.which == 27) {
		// esc
		app.reset(GAME_STATE.RE_START);
	}
};

function resizeWindow(e) {
	app.width = window.innerWidth;
	app.height = window.innerHeight;
	app.canvas.width = app.width;
	app.canvas.height = app.height;

	let ball = app.getNode('ball');
	ball.x = (app.width / 2) - (ball.radius / 2);
	ball.y = (app.height / 2) - (ball.radius / 2);
	ball.render();

	let player1 = app.getNode('player1');
	player1.x = 0;
	player1.y = (app.height / 2) - ((app.height * 10) / 100);
	player1.render();

	let player2 = app.getNode('player2');
	player2.x = app.width - (app.width / 100);
	player2.y = (app.height / 2) - ((app.height * 10) / 100);
	player2.render();

	let score = app.getNode('score-info');
	score.x = app.width / 2;
	score.y = 50;
	score.render();
}

var app = {
	//initial variables
	canvas: null,
	context: null,

	//resizing
	width: window.innerWidth,
	height: window.innerHeight,

	//nodes
	nodes: [],

	//timing
	timestamp: 0,
	now: Date.now(),
	lastUpdate: 0,
	gameState: GAME_STATE.PAUSED,
	init: function () {
		this.canvas = document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');
		this.render();
		this.onInit();
	},
	render: function () {
		this.clear();
		this.update();
		window.requestAnimationFrame(this.render.bind(this));
	},
	clear: function () {
		this.context.clearRect(0, 0, this.width, this.height);
	},
	update: function () {
		var dt = Date.now() - this.lastUpdate;
		this.onUpdate(dt);
		for (var index in this.nodes) {
			this.nodes[index].render();
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
		return { x: null, y: null, width: null, height: null, movement: { direction: { x: null, y: null }, speed: null }, keydownControls: null, keyupControls: null };
	},
	onInit: function () {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.backgroundColor = "black";
		this.nodes.push({
			id: 'player1',
			score: 0,
			x: 0,
			y: (this.height / 2) - ((this.height * 10) / 100),
			width: this.width / 100,
			height: (this.width * 10) / 100,
			color: 'orange',
			movement: {
				direction: {
					x: 0,
					y: 0
				},
				speed: 0
			},
			// render method for player
			render: function () {
				this.y += this.movement.direction.y * this.movement.speed;
				// force positioning the paddle
				if (this.y < 0) {
					this.y = 0;
				} else if ((this.y + this.height) > app.height) {
					this.y = app.height - this.height;
				}
				app.context.fillStyle = this.color;
				app.context.fillRect(this.x, this.y, this.width, this.height);
			},
			// handle keydown to the player object
			keydownControls: function (e) {
				if (e.keycode === 87 || e.which == 87) {
					// w
					this.movement.direction.y = (this.y > 5) ? -1 : 0;
					this.movement.speed = app.gameState === GAME_STATE.PAUSED ? 0 : 10;
				} else if (e.keycode === 83 || e.which == 83) {
					// s
					this.movement.direction.y = ((this.y + this.height) < app.height) ? 1 : 0;
					this.movement.speed = app.gameState === GAME_STATE.PAUSED ? 0 : 10;
				}
			},
			// handle keyup to the player object
			keyupControls: function (e) {
				this.movement.speed = 0;
			}
		});
		this.nodes.push({
			id: 'player2',
			score: 0,
			x: this.width - (this.width / 100),
			y: (this.height / 2) - ((this.height * 10) / 100),
			width: this.width / 100,
			height: (this.width * 10) / 100,
			color: 'green',
			movement: {
				direction: {
					x: 0,
					y: 0
				},
				speed: 0
			},
			// render method for player
			render: function () {
				this.y += this.movement.direction.y * this.movement.speed;
				// force positioning the paddle
				if (this.y < 0) {
					this.y = 0;
				} else if ((this.y + this.height) > app.height) {
					this.y = app.height - this.height;
				}
				app.context.fillStyle = this.color;
				app.context.fillRect(this.x, this.y, this.width, this.height)
			},
			// handle keydown to the player object
			keydownControls: function (e) {
				if (e.keycode === 38 || e.which == 38) {
					// up
					this.movement.direction.y = (this.y > 5) ? -1 : 0;
					this.movement.speed = app.gameState === GAME_STATE.PAUSED ? 0 : 10;
				} else if (e.keycode === 40 || e.which == 40) {
					// down
					this.movement.direction.y = ((this.y + this.height) < app.height) ? 1 : 0;
					this.movement.speed = app.gameState === GAME_STATE.PAUSED ? 0 : 10;
				}
			},
			// handle keyup to the player object
			keyupControls: function (e) {
				this.movement.speed = 0;
			}
		});
		this.nodes.push({
			id: 'ball',
			x: (this.width / 2) - (this.width / 100 / 2),
			y: (this.height / 2) - (this.height / 100 / 2),
			color: 'white',
			radius: this.width / 100,
			movement: {
				direction: {
					x: 0,
					angle: 0
				},
				speed: 0
			},
			// render method for ball
			render: function () {
				this.x += this.movement.direction.x * this.movement.speed * Math.cos(this.movement.direction.angle);
				this.y += this.movement.speed * Math.sin(this.movement.direction.angle);
				app.context.fillStyle = this.color;
				app.context.beginPath();
				app.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				app.context.closePath();
				app.context.fill();
			}
		});
		// attach keydown, keyup and resize as global attach
		// we will handle event on each asset
		document.addEventListener('keydown', bindKeyDown);
		document.addEventListener('keyup', bindKeyup);
		window.addEventListener('resize', resizeWindow);
	},
	onUpdate: function (dt) {
		let ball = this.getNode('ball');
		let player1 = this.getNode('player1');
		let player2 = this.getNode('player2');

		let player = ball.movement.direction.x === 1 ? player2 : player1;
		let isCollides = collisionDetect(player, ball);
		if (isCollides) {
			ball.movement.direction.x = (ball.movement.direction.x === -1) ? 1 : -1;
			ball.movement.direction.angle = 0;
			if (ball.y <= (player.y + player.height / 2)) {
				ball.movement.direction.angle = -1 * Math.PI / 4;
			} else if (ball.y >= (player.y + player.height / 2)) {
				ball.movement.direction.angle = Math.PI / 4;
			}
		} else {
			if (ball.movement.direction.x === 1) {
				if (ball.x >= this.width) {
					ball.movement.direction.x = -1;
					player1.score += 1;
					this.reset(GAME_STATE.SCORED);
				}
			} else if (ball.movement.direction.x === -1) {
				if (ball.x <= 0) {
					ball.movement.direction.x = 1;
					player2.score += 1;
					this.reset(GAME_STATE.SCORED);
				}
			}
			if ((ball.y - ball.radius) <= 0) {
				ball.movement.direction.angle = -1 * ball.movement.direction.angle;
			} else if (ball.y + ball.radius >= this.height) {
				ball.movement.direction.angle = -1 * ball.movement.direction.angle;
			}
		}
		this.drawText('score-info', this.width / 2, 50, 'grey', (player1.score || 0) + ':' + (player2.score || 0), 'center', '48px Arial');
	},
	reset: function (state) {
		let ball = this.getNode('ball');
		let player1 = this.getNode('player1');
		let player2 = this.getNode('player2');

		// each asset to initial asset state

		ball.x = (this.width / 2) - (ball.radius / 2);
		ball.y = (this.height / 2) - (ball.radius / 2);
		ball.movement.speed = 0;

		player1.x = 0;
		player1.y = (this.height / 2) - ((this.height * 10) / 100);
		player1.movement.speed = 0;

		player2.x = this.width - (this.width / 100);
		player2.y = (this.height / 2) - ((this.height * 10) / 100);
		player2.movement.speed = 0;

		this.gameState = GAME_STATE.PAUSED;
		if (state === GAME_STATE.RE_START) {
			player1.score = 0;
			player2.score = 0;
		}
	},
	pause: function () {
		let ball = this.getNode('ball');
		if (this.gameState === GAME_STATE.PAUSED) {
			this.gameState = GAME_STATE.RUNNING;
			ball.movement.direction.x = [-1, 1][Math.floor(Math.random() * 1)];
			ball.movement.speed = 8;
		} else if (this.gameState === GAME_STATE.RUNNING) {
			this.gameState = GAME_STATE.PAUSED;
			ball.movement.speed = 0;
		}
	},
	drawText: function (id, x, y, color, text, align, font) {
		let textNode = this.getNode(id);
		if (textNode.id) {
			// if text exists, just simply update the value
			textNode.x = x;
			textNode.y = y;
			textNode.color = color;
			textNode.text = text;
			textNode.align = align;
			textNode.font = font;
		} else {
			// if text is not exists, add a new node
			this.nodes.push({
				id: id,
				x: x,
				y: y,
				color: color,
				text: text,
				render: function () {
					app.context.fillStyle = this.color;
					app.context.textAlign = align;
					app.context.fillText(this.text, this.x, this.y);
					app.context.font = font;
				}
			});
		}
	}
};