// ==============================================================================================================================================================
// Contains game state logic.
// ==============================================================================================================================================================

import { playersLogic, resetPlayerPosition, detectPlayerKeysDown, detectPlayerKeysUp } from "./player.js";
import { BallLogic, BallAngle, BallHitNet } from "./ball.js";
import { randomColor, randomValue } from "./fun.js";
import { collision } from "./collision.js";

function ResetPlayers(playerOne, playerTwo) {
    // Reset players position.
    resetPlayerPosition(playerOne);
    resetPlayerPosition(playerTwo);
}

function ResetBall(ball, gameState) {
    // Reset ball position.
    ball.x = app.width / 2;
    ball.y = app.height / 2;
    ball.speed = gameState.defaultBallSpeed;
}

function UpdateScoreText(playerOne, playerTwo, scoreText) {
    scoreText.text = playerOne.score + " - " + playerTwo.score;
}

function updateScore(player) { player.score += 1; }

function RestGame(gameState) { gameState.paused = true; }

function PlayerWon(player, gameState) { return player.score >= gameState.maxScore ? true : false }

function GameWon(player, gameState, statusText) {
    if (player == 1) {
        statusText.text = "Player One has won the game!"
        gameState.end = true;
    } else if (player == 2) {
        gameState.end = true;
        statusText.text = "Player Two has won the game!"
    }
}

function gameStatus(ball, playerOne, playerTwo, gameState, scoreText, statusText) {

    let scoredPlayer = BallHitNet(ball);
    switch (scoredPlayer) {
        case 1:
            ResetBall(ball, gameState);

            ResetPlayers(playerOne, playerTwo);

            updateScore(playerOne);

            UpdateScoreText(playerOne, playerTwo, scoreText);

            RestGame(gameState);

            if (PlayerWon(playerOne, gameState)) {
                GameWon(1, gameState, statusText);
            }
            break;
        case 2:
            ResetBall(ball, gameState);

            ResetPlayers(playerOne, playerTwo);

            updateScore(playerTwo);

            UpdateScoreText(playerOne, playerTwo, scoreText);

            RestGame(gameState);

            if (PlayerWon(playerTwo, gameState)) {
                GameWon(2, gameState, statusText);
            }

            break;
        default:
            break;
    }
}

function gameLogic(ball, playerOne, playerTwo, gameState, scoreText, statusText) {

    if (!gameState.paused) {

        let angle = BallAngle(ball);

        playersLogic(playerOne, playerTwo);

        BallLogic(ball, angle);

        collision(ball, angle, playerOne, playerTwo);

        gameStatus(ball, playerOne, playerTwo, gameState, scoreText, statusText);
    }
}

function SpawnPlayers(app) {
    app.nodes.push({
        id: "racketOne",
        x: 10,
        y: app.height / 2,
        width: app.width / 100,
        height: app.height / 10,
        color: "black",
        direction: 0,
        speed: 4,
        score: 0,
    });

    app.nodes.push({
        id: "racketTwo",
        x: app.width - 20,
        y: app.height / 2,
        width: app.width / 100,
        height: app.height / 10,
        color: "black",
        direction: 0,
        speed: 4,
        score: 0,
    });

}

function SpawnBall(app) {
    // 1 or -1 based on value returned
    const ballXDirection = randomValue(-1, 1) >= 0.1 ? 1 : -1;
    const ballYDirection = randomValue(-1, 1);

    app.nodes.push({
        id: "ball",
        x: app.width / 2,
        y: app.height / 2,
        width: 10,
        height: 10,
        radius: 5,
        color: "black",
        directionX: ballXDirection,
        directionY: ballYDirection,
        speed: 4,
    });
}

function SpawnText(app) {
    app.nodes.push({
        id: "textScore",
        text: "0 - 0",
        x: 10,
        y: app.height - 20,
    });

    app.nodes.push({
        id: "textInstruction",
        text: "Space to pause/unpause",
        x: 30,
        y: 30,
    });

    app.nodes.push({
        id: "textStatus",
        text: "",
        x: 30,
        y: 60,
    });
}

function GameInit(app) {

    // Spawn objects.
    SpawnPlayers(app);
    SpawnBall(app);
    SpawnText(app);

    app.nodes.push({
        id: "gameState",
        defaultBallSpeed: 3,
        maxScore: 3,
        paused: true,
        end: false,
        maxBallSpeed: 9,
    });

    // detect inputs.
    detectPlayerKeysDown(app.getNode("racketOne"), app.getNode("racketTwo"));
    detectPlayerKeysUp(app.getNode("racketOne"), app.getNode("racketTwo"));

    randomColor();
}

export { gameLogic, GameInit }