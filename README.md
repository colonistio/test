# Talha's Colonist Test - Ping Pong Game

Authors: `TalhaKhamoor` `goktugyil`
Implemented a ping pong game according to the template provided.

## Steps Completed Before Starting Project

- Forked repository
- Created a new branch and switched into it.

## How To Run App

To run the app, download application off the repo. Make sure you have node.js installed. Go into your terminal and navigate to the folder that contains the index.js file. Use npm init to setup/create npm package. Use npm to install express. run node node index.js to start application.

## Starting Template

Template had `onInit` and `onUpdate` functions already created. I tried not to edit the app.js file too much as instructed, however, I ended up doing so inorder to allow some drawing functionality.

Initialization functions are in `onInit`, like key down and up bindings or players and ball.

`this.nodes.push(nodeProperties)` was provided to work with nodes in an array.
You can also use `this.getNode()` to get node properties.

Most of app.js was provided aswell as the index.js file. Some working functionalities were illustrated in index.html script, but nothing to revealing.

## Functionalities Completed

- Made the game cover the whole browser
- Added keyboard functionalities for both players, W and S for one player, Up and Down for another player.
- Addded players into canvas, made sure we can move players with keyboard.
- Added ball to the game, pressing `SPACE` button start's and pauses the game, made sure the ball bounces from boundries.
- When a player scores, scoring is shown with console.log aswell as on canvas. Game is then reset.

## Bonus Functionalities Completed

- Added draw text functionality to the engine. Introductory instructions and game title.
- Added score system for the game and used the drawText functionality on game.
- Added resize functionality
- Made the ball round
