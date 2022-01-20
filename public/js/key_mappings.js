// function that controlls mapping the user's keyboard inputs
document.onkeydown = (e) => {
	switch (e.keyCode) {
		// space bar will pause the game
		case 32:
			pause();
			break;
	}
};

// function that sets position of the paddle for the user
document.onmousemove = (e) => {
	// get the user's paddle
	const paddle = app.getNode("player_one");

	// set the location of the paddle based on the mouse
	paddle.y = e.y - paddle_height / 2;
};
