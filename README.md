# Ping Pong Game
This game is to demonstrate how to build a simple Ping Pong game through [Matter.js](https://brm.io/matter-js/), a physics engine.

The game is available on the Github page: [link](https://shawtim.github.io/ping-pong-game/).![image](https://user-images.githubusercontent.com/85455/135694451-2e44b80a-e4ad-46b4-b354-16e3f4ff4010.png)

## How to play
- `W` and `S` for Red Player to move
- `↑` and `↓` for Blue Player to move
- `SPACE` to start/pause/resume the game

## Game Physics
In Ping Pong game we can expect there will be plenties of collisions between the ball and the walls/players. In real world the ball won't be simply bounced back because of a lot of physics factors, like the force/mass/momentum/angular momentum. To simulate the reality we can apply a physics engine to do the job.

### Gravity
We don't have gravity for this game. Most physics engine comes with default gravity so we set it to zero first.

### Friction
That can mean air friction and frictions of the objects.

Air friction means a resistance force that can slow down object, which probably we don't want to see it applied on the ball (air friction applies on the player objects, though), so we better set it to zero. 

When the ball collides with another object with friction, since the friction force is a vector the ball may spin. This is actually an advanced technique on real world Ping Pong game. Feel free to add friction to the objects if we want to have more fun on this game.

### Elasticity
Elasticity is important for collision. Inelastic collision can cause engery loss which will slow down the ball for every collision. We may want to make sure the collision is elastic.

### Mass/Density
This is about the momentum changes after the collision. The relative mass of the ball needs to be sufficiently small such that it can be bounced with ~100% linear speed.

### Movement of the Players
Make sure the players are always on track. Players only move alone the vertical tracks. So besides setting a relatively high mass for the player objects, we need to cancel the horizontal movements of the player objects by setting the horizontal position and cancel horizontal velocity on every frame.

The players are supposingly moved by the force applied, which means the velocity will keep growing from zero. By experiments this may not be the experiences that users want (although it's real). We need to fine tune the interaction of player movement on it.

## Other Physics examples
You may visit [my project](https://shawtim.github.io/itdog-slaughterhouse/) which is also built by Matter.js.
