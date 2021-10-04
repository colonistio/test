// check if ball hit canvas borders. (left/Right)
function BallHitNet(ball) {
    if (ball == undefined) {
        console.log("BallHitNet: ball is undefined");
        return;
    }

    let xBallBounds = ball.x + ball.width;
    if (xBallBounds > app.width) {
        return 1;                                   // returns 1 if player one scored.
    } else if (xBallBounds < 0) {
        return 2;                                   // returns 2 if player two scored.
    }
    return 0;                                       // return 0 if it didnt hit the net.
}


// check if ball hit canvas borders. (Up/Down)
function BallHitCanvas(ball) {
    let yBallBounds = ball.y + ball.height;
    if (ball.y <= 0 || yBallBounds >= app.height) { return true }
    return false;
}

// Helper functions.
function IncreaseBallSpeedPerHit(ball) { ball.speed += 0.9; }

function ChangeBallDirection(ball) { ball.directionX = -ball.directionX; }

function BallBounce(ball, angle) { ball.directionY = Math.tan(-angle) * ball.directionX; }

function BallAngle(ball) { return Math.atan(ball.directionY / ball.directionX); }

function BallLogic(ball, angle) {
    ball.x += ball.directionX * ball.speed; // Move ball horizontally based on direction and speed.
    ball.y += ball.directionY * ball.speed; // Move ball vertically based on direction and speed.
    if (BallHitCanvas(ball)) { BallBounce(ball, angle); }
}

export { BallLogic, BallHitNet, BallAngle, BallBounce, ChangeBallDirection, IncreaseBallSpeedPerHit }