/**
 * Function that is called to run the main logic and animations
 *
 * main purposes:
 *  1. update the position of the ball
 *  2. make the ball bounce or check if it has hit a paddle
 *    2a. if the ball goes out of bounds, reset game and tally score
 *  3. increase ball speed if user has hit it certain amount of times
 *  4. move the bot
 */
app.onUpdate = function (time) {
	// if the user has paused the game, return
	if (paused) return;

	// get the ball
	const ball = this.getNode("ball");

	// update the position of the ball
	ball.x = ball.x + ball.xv;
	ball.y = ball.y + ball.yv;

	// if the ball goes out of bounds vertically make it bounce
	if (ball.y < 0 || ball.y > this.height) ball.yv = -ball.yv;

	// if the ball goes out of bounds horizontally, add tally and restart
	if (ball.x < 0 || ball.x > this.width) {
		if (ball.x < 0) bot_score++;
		else user_score++;

		reset_game();
	}
	if (hits % 6 === 5) {
		// reset the hits to prevent hits increasing each iteration
		hits = 0;

		// if the ball speed incremented won't warp through paddles
		if (ball.xv + 0.5 < paddle_width) ball.xv += 0.5;
	}

	// check to see if the ball has hit either paddle
	hit_paddle(ball);

	// update the bots position
	move_bot(ball);
};

/**
 * Function that updates the bot's location so that it doesn't miss the ball
 *
 * @return: void
 */
const move_bot = (ball) => {
	// get the bot and calculate the middle of the paddle
	const bot = app.getNode("bot");
	const bot_middle = bot.y + paddle_height / 2;

	// get the difference in the position of the ball vs bot
	let difference = bot_middle - ball.y;

	// if the ball is above the middle of the bot
	if (difference > 0) bot.y -= bot_increment;
	// if the ball is below the middle of the bot
	else bot.y += bot_increment;
};

/**
 * Function that handles the logic for if the ball hits
 * either of the paddles
 *
 * @param ball: the ball object
 * @return: void
 */
const hit_paddle = (ball) => {
	// make universal function for if the paddles hit the ball
	const handle_hit = (current) => {
		// must be in hittable and in paddle window

		// difference in where the ball is compared to top of paddle
		const position = ball.y - current.y;

		// split the paddle into 5 parts
		const length = paddle_height / 5;

		// make the ball bounce off the paddle
		ball.xv = -ball.xv;

		if (position > length * 4) {
			// bottom segment
			ball.yv = ball.xv * 1.2;
			// ball.yv = max_ball_vertical * 2;
		} else if (position > length * 3) {
			// next segment
			ball.yv = ball.xv * 0.8;
			// ball.yv = max_ball_vertical * 1.5;
		} else if (position > length * 2) {
			// middle segment
			// do nothing but bounce back
		} else if (position > length * 1) {
			// next segment
			ball.yv = -ball.xv * 0.8;
			// ball.yv = -max_ball_vertical * 1.5;
		} else {
			// top segment
			ball.yv = -ball.xv * 1.2;
			// ball.yv = -max_ball_vertical * 2;
		}
	};

	// get both of the paddles
	const user_paddle = app.getNode("player_one");
	const bot_paddle = app.getNode("bot");

	// check to see if the ball has hit the user paddle
	if (
		ball.x - ball_radius < paddle_offset + paddle_width &&
		ball.x - ball_radius > paddle_offset &&
		user_paddle.y < ball.y - ball_radius &&
		user_paddle.y + paddle_height > ball.y + ball_radius
	) {
		// incrememnt the user's hit counter
		++hits;

		handle_hit(user_paddle);
	}

	// if the ball hit the bot's paddle
	else if (
		ball.x - ball_radius > app.width - paddle_offset - paddle_width &&
		ball.x - ball_radius < app.width - paddle_offset &&
		bot_paddle.y + paddle_height > ball.y - ball_radius &&
		bot_paddle.y < ball.y + ball_radius
	) {
		handle_hit(bot_paddle);
	}
};

/**
 * Function that handles each time the game restarts.
 *
 * Cases for this:
 * 	1. on page load
 *  2. each time the player or bot scores
 *
 * @return: void
 */
const reset_game = () => {
	// set the new scores to the html
	document.getElementById("user").innerHTML = user_score;
	document.getElementById("bot").innerHTML = bot_score;

	// reset the hits
	hits = 0;

	// reset the nodes inside of app with default configuration
	app.nodes = [
		{
			// make the player
			id: "player_one",
			type: "paddle",
			x: paddle_offset,
			y: app.height / 2 - paddle_height / 2,
			width: paddle_width,
			height: paddle_height,
			color: "black",
		},
		{
			// make the bot
			id: "bot",
			type: "paddle",
			x: app.width - paddle_offset - paddle_width,
			y: app.height / 2 - paddle_height / 2,
			width: paddle_width,
			height: paddle_height,
			color: "black",
		},
		{
			// make the ball
			id: "ball",
			type: "ball",
			x: app.width / 2,
			y: app.height / 2,
			radius: ball_radius,
			color: "black",
			xv: ball_horizontal,
			yv: Math.random() * 2 - 1,
		},
	];
};

// initializaiton function
app.onInit = function () {
	reset_game();
};
