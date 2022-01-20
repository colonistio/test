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
