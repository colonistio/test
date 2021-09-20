const startSpeed = 4;
const speedIncrement = .2;
const ballSize = 10;

/**
 * The ball that bounces back and forth
 */
class Ball {
    constructor(id, x, y) {
        this.id = id;
        this.startX = x;
        this.startY = y;
        this.width = ballSize;
        this.height = ballSize;
        this.radius = ballSize / 2;
        this.color = 'black';
        this.resetPosition();
    }

    resetPosition() {
        this.x = this.startX;
        this.y = this.startY;
        this.speed = startSpeed;
        let angle = Math.random() * Math.PI * 2;
        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = Math.sin(angle) * this.speed;
    }

    #move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    #collisionDetect(paddle) {
        paddle.top = paddle.y;
        paddle.right = paddle.x + paddle.width;
        paddle.bottom = paddle.y + paddle.height;
        paddle.left = paddle.x;

        this.top = this.y;
        this.right = this.x + this.radius;
        this.bottom = this.y + this.radius;
        this.left = this.x;

        return this.left < paddle.right
            && this.top < paddle.bottom
            && this.right > paddle.left
            && this.bottom > paddle.top;
    }

    #checkForPaddleBounces() {
        let paddle = (this.x < app.width / 2) ? app.getNode('player1') : app.getNode('player2');

        if (this.#collisionDetect(paddle, ball)) {
            let angle = 0;

            // if ball hit the top of paddle
            if (this.y < (paddle.y + paddle.height / 2)) {
                angle = -1 * Math.PI / 4;
            }
            // if it hit the bottom of paddle
            else if (this.y > (paddle.y + paddle.height / 2)) {
                angle = Math.PI / 4;
            }

            // change velocity of ball according to which paddle the ball hits
            this.velocityX = (paddle === app.getNode('player1') ? 1 : -1) * this.speed * Math.cos(angle);
            this.velocityY = this.speed * Math.sin(angle);

            // increase ball speed
            this.speed += speedIncrement;
        }
    }

    #checkForWallBounces() {
        // bounce top and bottom walls
        if (this.y + this.radius >= app.height || this.y - this.radius <= 0) {
            this.velocityY = -this.velocityY;
        }

        // right side
        if (this.x > app.width) {
            app.getNode('player1').addScore();
            app.restartMatch();
        }
        // left side
        else if (this.x + this.width < 0) {
            app.getNode('player2').addScore();
            app.restartMatch();
        }
    }

    update(time) {
        this.#move();
        this.#checkForPaddleBounces();
        this.#checkForWallBounces();
    }
}

