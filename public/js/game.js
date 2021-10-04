// ==============================================================================================================================================================
// Contains game state logic.
// ==============================================================================================================================================================

import { playersLogic, resetPlayerPosition } from "./player.js";
import { BallLogic, BallAngle, BallHitNet } from "./ball.js";
import { collision } from "./collision.js";

function ResetPlayers(playerOne, playerTwo) {
    // Reset players position.
    resetPlayerPosition(playerOne);
    resetPlayerPosition(playerTwo);
}

function ResetBall(ball) {
    // Reset ball position.
    ball.x = app.width / 2;
    ball.y = app.height / 2;
}

function UpdateScoreText(playerOne, playerTwo, scoreText) {
    scoreText.text = playerOne.score + " - " + playerTwo.score;
}

function WriteToScore(text, scoreText) {
    scoreText.text = text;
}

function updateScore(player) { player.score += 1; }

function RestGame(gameState) { gameState.paused = true; }

function PlayerWon(player, gameState) { return player.score >= gameState.maxScore ? true : false }

function GameWon(player, scoreText, gameState) {
    if (player == 1) {
        WriteToScore("Player One has won the game!", scoreText);
        gameState.end = true;
    } else if (player == 2) {
        gameState.end = true;
        WriteToScore("Player Two has won the game!", scoreText);
    }
}

function gameStatus(ball, gameState, scoreText, playerOne, playerTwo) {
    let scoredPlayer = BallHitNet(ball);
    switch (scoredPlayer) {
        case 1:
            ResetBall(ball);

            ResetPlayers(playerOne, playerTwo);

            updateScore(playerOne);

            UpdateScoreText(playerOne, playerTwo, scoreText);

            RestGame(gameState);

            if (PlayerWon(playerOne, gameState)) {
                GameWon(1, scoreText, gameState);
            }

            break;
        case 2:
            ResetBall(ball);

            ResetPlayers(playerOne, playerTwo);

            updateScore(playerTwo);

            UpdateScoreText(playerOne, playerTwo, scoreText);

            RestGame(gameState);

            if (PlayerWon(playerOne, gameState)) {
                GameWon(2, scoreText, gameState);
            }

            break;
        default:
            break;
    }
}

function gameLogic(ball, playerOne, playerTwo, gameState, scoreText) {
    if (!gameState.paused) {

        let angle = BallAngle(ball);

        playersLogic(playerOne, playerTwo);

        BallLogic(ball, angle);

        collision(ball, angle, playerOne, playerTwo);

        gameStatus(ball, gameState, scoreText, playerOne, playerTwo);
    }
}

export { gameLogic }