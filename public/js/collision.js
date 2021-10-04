import { BallBounce, ChangeBallDirection, IncreaseBallSpeedPerHit } from './ball.js'

// Gets the collision between two objects.
function BallHitRacket(ball, player) {
    if (ball == undefined) {
        console.log("BallToPlayerCollision: ball is undefined!");
        return;
    }

    if (player == undefined) {
        console.log("BallToPlayerCollision: player is undefined!");
        return;
    }

    return (
        ball.x < player.x + player.width &&
        ball.x + ball.width > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.height > player.y
    );
}

function collision(ball, angle, playerOne, playerTwo) {
    if (BallHitRacket(ball, playerOne) || BallHitRacket(ball, playerTwo)) {
        ChangeBallDirection(ball);
        IncreaseBallSpeedPerHit(ball);
        BallBounce(ball, angle);
    }
}

export { collision }