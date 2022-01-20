/**
 * Function that changes the games difficulty
 *
 * Note that this function will also completely reset
 * the game
 *
 * @param: the setting in which the game will switch to
 * @return: void
 */
const change_difficulty = (setting) => {
	// set the css for the difficulty
	document.getElementById("easy").classList.remove("selected");
	document.getElementById("medium").classList.remove("selected");
	document.getElementById("hard").classList.remove("selected");
	document.getElementById("rally").classList.remove("selected");
	document.getElementById(setting).classList.add("selected");

	// change the settings based on the difficulty
	switch (setting) {
		case "easy":
			bot_increment = 1.3;
			ball_horizontal = 3;
			break;
		case "medium":
			bot_increment = 5.5;
			ball_horizontal = 8;
			break;
		case "hard":
			bot_increment = 10;
			ball_horizontal = 13;
			break;
		case "rally":
			bot_increment = 10;
			ball_horizontal = 5;
			break;
	}

	// reset the scores of the user and the bot
	user_score = 0;
	bot_score = 0;

	// reset the ball and the paddles
	reset_game();
};

// function that pauses the game
const pause = () => {
	paused = !paused;
	if (paused) {
		document.getElementById("paused").classList.add("selected");
	} else {
		document.getElementById("paused").classList.remove("selected");
	}
};

// function that completely resets the game but keeps same difficulty
const hard_reset = () => {
	// reset the scores
	user_score = 0;
	bot_score = 0;

	reset_game();
};
