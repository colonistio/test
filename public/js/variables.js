// create variable allowing game to pause at any time
let paused = false;

// keep track of how many times the ball has bounced off the user's paddle
let hits = 0;

// create tally variables to keep track of scores
let user_score = 0,
	bot_score = 0;

// create constant variables for the paddles
const paddle_width = 20,
	paddle_height = 200,
	paddle_offset = 100;

// create the constant variables for the ball
const ball_radius = 10;

// create settings that will change with difficulty
let bot_increment = 1.3;
let ball_horizontal = 3;
