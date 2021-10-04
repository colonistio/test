// Contains player movement/logic

function DetectPlayerKeysDown(playerOne, playerTwo) {
    document.addEventListener("keydown", function (e) {
        switch (e.which) {
            case 83:
                playerOne.direction = -1;
                break;
            case 87:
                playerOne.direction = 1;
                break;
            case 38:
                playerTwo.direction = 1;
                break;
            case 40:
                playerTwo.direction = -1;
                break;
            case 32:
                app.pause();
                break;
            default:
                break;
        }
    });
}

function DetectPlayerKeysUp(playerOne, playerTwo) {
    document.addEventListener("keyup", function (e) {
        switch (e.which) {
            case 83:
                playerOne.direction = 0;
                break;
            case 87:
                playerOne.direction = 0;
                break;
            case 38:
                playerTwo.direction = 0;
                break;
            case 40:
                playerTwo.direction = 0;
                break;
            default:
                break;
        }
    });
}

function PlayerToCanvasBounds(player) {
    if (player == undefined) {
        console.log("CheckBoundsPlayer: Player is undefined");
        return;
    }
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > app.height) {
        player.y = app.height - player.height;                  // set the player y to (canvas height - player height).
    }
}

function PlayersLogic(playerOne, playerTwo) {

    playerOne.y -= playerOne.direction * playerOne.speed; // Move playerOne horizontally based on the direction * speed.
    playerTwo.y -= playerTwo.direction * playerTwo.speed; // Move playerRwo vertically based on the direction * speed.

    DetectPlayerKeysDown(playerOne, playerTwo);
    DetectPlayerKeysUp(playerOne, playerTwo);

    PlayerToCanvasBounds(playerOne);
    PlayerToCanvasBounds(playerTwo);
}



export { PlayersLogic };