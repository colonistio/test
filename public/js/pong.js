		var DIRECTION = {
			IDLE: 0,
			UP: 1,
			DOWN: 2,
			LEFT: 3,
			RIGHT: 4
		};
		var rounds = [5, 5, 3, 3, 2];
		var colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6'];
		var brands = ["\uf092", "\uf0d4", "\uf08c", "\uf3bb", "\uf2d8", "\uf1d2", "\uf082", "\uf167", "\uf081"];
		var ballCode = "\uf1a1";
		var over = true;
		var pause = false;
		var pausedState = false;
		var lastScoreTime = 0;
		var rplayer;
		var lplayer;
		var ball;

		app.onInit = function(){
            this.onResize();
			this.canvas.style.width = this.width + 'px';
			this.canvas.style.height = this.height + 'px';

			this.nodes.push({
				id: 'lplayer',
				width: this.canvas.width / 45,
				height: this.canvas.height / 6,
				x: (this.canvas.width / 8),			// 800->150
				y: (this.canvas.height / 2) - 35,
				font: null,
				color  : 'red',
				score: 0,
				move: DIRECTION.IDLE,
				speed: 10
			});

			this.nodes.push({
				id: 'rplayer',
				width: this.canvas.width / 45,
				height: this.canvas.height / 6,
				x: this.canvas.width - (this.canvas.width / 8),
				y: (this.canvas.height / 2) - 35,
				font: null,
				color  : 'black',
				score: 0,
				move: DIRECTION.IDLE,
				speed: 10
			});

			this.nodes.push({
				id: 'ball',
				width: 48,
				height: 48,
				fontCode: ballCode,
				fontColor: '#000',
				fontSize: '48px',
				color  : 'transparent',
				x: (this.canvas.width / 2) - 24,
				y: (this.canvas.height / 2) - 24,
				moveX: DIRECTION.IDLE,
				moveY: DIRECTION.IDLE,
				speed: 10
			});

			this.running = this.over = false;
			this.pause = false;
			this.timer = this.round = 0;

			lplayer = this.getNode('lplayer');
			rplayer = this.getNode('rplayer');
			ball = this.getNode('ball');
			this.getNode('lplayer').speed = 8;
			this.getNode('rplayer').speed = 8;
			this.turn = this.getNode('lplayer').id;

			app.listen();
		};

		app.menu = function () {
			this.context.font = '50px Courier New';
			this.context.fillRect(this.canvas.width / 2 - 350, this.canvas.height / 2 - 48, 700, 100);
			this.context.fillStyle = '#000';
			this.context.fillText('Press any key to begin', this.canvas.width / 2, this.canvas.height / 2 + 15);
		};

		app.reset = function() {
			this.pause = true;
		};

		app.pauseGame = function() {
			this.pause != this.pause;
		};

		app.unpauseGame = function() {
			this.pause = false;
		};

		app.listen = function(){
			document.addEventListener('keydown', function (key) {
			    var keycode = (key.keyCode ? key.keyCode : key.which);

				if (this.running === false) {
					this.running = true;
				}
				if (keycode === 32) {
					console.log('space');
					this.pause = false;
				}
				if (!this.pause && keycode === 38)
					rplayer.move = DIRECTION.UP;

				if (!this.pause && keycode === 40)
					rplayer.move = DIRECTION.DOWN;

				if (!this.pause && keycode === 87)
					lplayer.move = DIRECTION.UP;

				if (!this.pause && keycode === 83)
					lplayer.move = DIRECTION.DOWN;
			});

			document.addEventListener('keyup', function (key) {
				lplayer.move = DIRECTION.IDLE; 
				rplayer.move = DIRECTION.IDLE; 
			});
		};

		app.drawItems = function () {
			for(var index in this.nodes){
				var node = this.nodes[index];
				if(node.fontCode !== null && node.fontCode !== undefined){
					this.context.fillStyle = node.fontColor;
					this.context.font = node.fontSize + ' FontAwesome';
					this.context.textAlign = 'center';
					this.context.textBaseline = 'middle';
					this.context.fillText(node.fontCode, node.x+(node.width/2), node.y+(node.height));
				}
			}
		};

		app.drawArena = function() {
			this.context.beginPath();
			this.context.setLineDash([7, 15]);
			this.context.moveTo((this.canvas.width / 2), 0);
			this.context.lineTo((this.canvas.width / 2), this.canvas.height);
			this.context.lineWidth = 10;
			this.context.strokeStyle = '#000';
			this.context.stroke();

			// Draw the players score
			this.context.font = Math.round(this.canvas.width/12) + 'px Courier New';
			this.context.textAlign = 'center';
			this.context.fillStyle = '#000';

			var srplayer = this.getNode('rplayer').score ? this.getNode('rplayer').score.toString() : '0';
			this.context.fillText(srplayer, (this.canvas.width / 2) - (this.canvas.width / 2)+30, (this.canvas.height / 2) - 20);

			var slplayer = this.getNode('lplayer').score ? this.getNode('lplayer').score.toString() : '0';
			this.context.fillText(slplayer, (this.canvas.width / 2) + (this.canvas.width / 2)-30, (this.canvas.height / 2) - 20);

			this.context.font = Math.round(this.canvas.width/24) + 'px Courier New';
			this.context.fillText('Round ' + (app.round + 1), (this.canvas.width / 2) + 8, (this.canvas.height / 6) - 20);
		};

		app._resetTurn = function(victor, loser) {
			if(this.turn !== loser.id){
				this.ball = this.getNode('ball');

				this.turn = loser.id;
				this.timer = (new Date()).getTime();

			    var ds = Date.now() - this.lastScoreTime;
			    if(ds > 100) {			    				// wait 3 secs for the next score increase
					this.getNode(victor.id).score++;
					this.getNode('ball').x = (this.canvas.width / 2) - (this.getNode('ball').width / 2);
					this.getNode('ball').y = (this.canvas.height / 2) - (this.getNode('ball').height / 2);
			    }
				this.lastScoreTime = Date.now();
			}
		};

		app._turnDelay = function() {
			return ((new Date()).getTime() - this.timer >= 1000);
		};

		app.handleCollisions = function() {
			var ballX = this.getNode('ball').x;
			var ballY = this.getNode('ball').y;
			var ballW = this.getNode('ball').width;
			var ballH = this.getNode('ball').height;
			var rplayerX = this.getNode('rplayer').x;
			var rplayerY = this.getNode('rplayer').y;
			var rplayerW = this.getNode('rplayer').width;
			var rplayerH = this.getNode('rplayer').height;
			var lplayerX = this.getNode('lplayer').x;
			var lplayerY = this.getNode('lplayer').y;
			var lplayerW = this.getNode('lplayer').width;
			var lplayerH = this.getNode('lplayer').height;

			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.getNode('ball').x <= 0) 
				this._resetTurn(this.getNode('lplayer'), this.getNode('rplayer'));

			if (this.getNode('ball').x >= this.canvas.width - this.getNode('ball').width) 
				this._resetTurn(this.getNode('rplayer'), this.getNode('lplayer'));

			if (this.getNode('ball').y <= 0) 
				this.getNode('ball').moveY = DIRECTION.DOWN;

			if (this.getNode('ball').y >= this.canvas.height - this.getNode('ball').height) 
				this.getNode('ball').moveY = DIRECTION.UP;

			if (!this.over) {

				// serve ball & randomize direction
				if (this._turnDelay() && this.turn) {
					this.getNode('ball').moveX = (this.turn === this.getNode('rplayer').id) ? DIRECTION.RIGHT : DIRECTION.LEFT;
					this.getNode('ball').moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
					this.getNode('ball').y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
					this.turn = null;
				}
				//
				// collisions start here...
				//
				// If the player collides with the bound limits, update the x and y coords.
				if (rplayerY + 1 <= 0)
					this.getNode('rplayer').y = 0;
				else if (rplayerY - 1 >= this.canvas.height - rplayerH)
					this.getNode('rplayer').y = this.canvas.height - rplayerH;

				if (lplayerY + 1 <= 0)
					this.getNode('lplayer').y = 0;
				else if (lplayerY - 1 >= this.canvas.height - lplayerH)
					this.getNode('lplayer').y = this.canvas.height - lplayerH;

				//
				// paddle-collisions start here...
				//
				// Handle right player-ball collisions
				if (ballX + ballW -1 >= rplayerX &&
					ballX -1 <= rplayerX + rplayerW &&
					ballY - (ballH/2) <= rplayerY + rplayerH && 
					ballY + (ballH/2) >= rplayerY)
				{	// if ball is at least halfly colliding with the lplayer
					this.getNode('ball').x = rplayerX - ballW;
					this.getNode('ball').moveX = DIRECTION.LEFT;
				}
				// Handle left player-ball collision
				if (ballX -1 <= lplayerX + lplayerW &&
					ballX + ballW -1 >= lplayerX &&
					ballY - (ballH/2) <= lplayerY + lplayerH && 
					ballY + (ballH/2) >= lplayerY)
				{
					this.getNode('ball').x = lplayerX + lplayerW;
					this.getNode('ball').moveX = DIRECTION.RIGHT;
				}
				//
				// movements start here...
				//
				// Move player if they player.move value was updated by a keyboard event
				if (this.getNode('rplayer').move === DIRECTION.UP) 
					this.getNode('rplayer').y -= this.getNode('rplayer').speed;

				else if (this.getNode('rplayer').move === DIRECTION.DOWN) 
						 this.getNode('rplayer').y += this.getNode('rplayer').speed;

				if (this.getNode('lplayer').move === DIRECTION.UP) 
					this.getNode('lplayer').y -= this.getNode('lplayer').speed;

				else if (this.getNode('lplayer').move === DIRECTION.DOWN) 
						 this.getNode('lplayer').y += this.getNode('lplayer').speed;

				// Move ball in intended direction based on moveY and moveX values
				if (this.getNode('ball').moveY === DIRECTION.UP)
					this.getNode('ball').y -= (this.getNode('ball').speed / 1.5);

				else if (this.getNode('ball').moveY === DIRECTION.DOWN)
					this.getNode('ball').y += (this.getNode('ball').speed / 1.5);

				if (this.getNode('ball').moveX === DIRECTION.LEFT)
					this.getNode('ball').x -= this.getNode('ball').speed;

				else if (this.getNode('ball').moveX === DIRECTION.RIGHT) 
					this.getNode('ball').x += this.getNode('ball').speed;

				if (ballX + ballW > lplayerX + lplayerW)
					this._resetTurn(this.getNode('rplayer'), this.getNode('lplayer'));
				if (ballX - ballW < rplayerX)
					this._resetTurn(this.getNode('lplayer'), this.getNode('rplayer'));
			}

			// Handle the end of round transition
			if (this.getNode('rplayer').score === rounds[this.round]) {

				if (!rounds[this.round + 1] && this.round) {
					if(this.round >= rounds.length - 1){
						console.log('game finished.');
						this.over = true;
						this.round = 0;
					}

				} else {
					// If there is another round, reset all the values and increment the round number.
					if(!this.getNode('lplayer').score || !this.getNode('rplayer').score) {
						console.log('game started.');
					}else{
						console.log('round '+this.round+' finished with left player scoring '+this.getNode('lplayer').score+' and right player scoring '+this.getNode('rplayer').score);
					}
					this.getNode('rplayer').score = this.getNode('lplayer').score = 0;
					this.getNode('rplayer').speed += 0.5;
					this.getNode('lplayer').speed += 1;
					this.getNode('ball').speed += 1;
					this.round += 1;
				}
			}

			// Check to see if the lplayer has won the round.
			else if (this.getNode('lplayer').score === rounds[this.round]) {

				if (!rounds[this.round + 1] && this.round) {
					if(this.round >= rounds.length - 1){
						console.log('game finished.');
						this.over = true;
						this.round = 0;
					}

				} else {
					// If there is another round, reset all the values and increment the round number.
					if(!this.getNode('lplayer').score || !this.getNode('rplayer').score) {
						console.log('game started.');
					}else{
						console.log('round '+this.round+' finished with left player scoring '+this.getNode('lplayer').score+' and right player scoring '+this.getNode('rplayer').score);
					}
					this.getNode('lplayer').score = this.getNode('rplayer').score = 0;
					this.getNode('lplayer').speed += 0.5;
					this.getNode('rplayer').speed += 1;
					this.getNode('ball').speed += 1;
					this.round += 1;
				}
			}
		};

		app.onResize = function() {
			app.drawArena();
			app.drawItems();
		};

		app.onUpdate = function(time) {
			this.clear();
			this.drawArena();
			this.drawItems();
			if(!this.pause){
				this.handleCollisions();
			}
		};

