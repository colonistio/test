# Talha's Colonist Test - Ping Pong Game

Authors: `goktugyil` `TalhaKhamoor`
Implemented a ping pong game according to the template provided.

## Steps Completed Before Starting Project

- Forked repository
- Created a new branch and switched into it.

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

## After Finishing

- On your repository create a PR merging your feature branch into your master branch.
- Add a very good description on what it is, make sure to include video showcasing. [Read & apply the best practices](https://medium.com/@hugooodias/the-anatomy-of-a-perfect-pull-request-567382bb6067).
- Invite collaborators `demiculus` & `goktugyil` to the repo.
- Request reviews for the PR from `demiculus` & `goktugyil`.

## Notes

- Make sure game has state functions like reset, start and pause. We should be able to trigger them with `app.reset()` or `app.pause()`.
- Make sure players or ball uses app.width and app.height values dynamicly, hard coded values will be rejected.

## Guidelines

- Break down your commits into the smallest commit that represents a cohesive feature that is in a build-able state.
- This is a good place to show off your architeture, clean code, modularity, extensibility knowledge.
