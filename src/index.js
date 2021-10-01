import "./index.css";

import Matter from "matter-js";
import { placeWalls, placeBall, placeLoseZone, placePlayer } from "./placeBodies";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WALL_THICKNESS = 50;
const BALL_RADIUS = 30;
const PLAYER_SIZE = { width: 50, height: 300 };
const PLAYER_INIT_VELOCITY = 20;
const PLAYER1_COLOR = "red";
const PLAYER2_COLOR = "blue";
const LOSE_ZONE = 150;
const DEFAULT_FONT_COLOR = "rgba(0, 0, 0, 0.4)";
const DEFAULT_FONT = "48px Arial";
const INTRO_TEXT1 = "Player 1: WS to move";
const INTRO_TEXT2 = "Player 2: ↑↓ to move";
const INTRO_TEXT3 = "Press \"SPACE\" to start";
const SCORE_FONT = "300px Arial";
const SCORE_COLOR = "rgba(0, 0, 0, 0.2)";
const PAUSE_GAME_TEXT = "Press \"SPACE\" to pause";
const RESUME_GAME_TEXT = "Press \"SPACE\" to resume";
const NEXT_GAME_TEXT = "Press \"SPACE\" for next game!";

const { Engine, Render, Runner, Body, Sleeping, Events } = Matter;
const app = {
  node: document.body,
  engine: null,
  world: null,
  render: null,
  runner: null,
  walls: null,
  ball: null,
  loseZone1: null,
  loseZone2: null,
  player1: null,
  player2: null,
  score1: 0,
  score2: 0,
  isPaused: false,
  hasLost: false,
  lastBallVelocity: null,
};

const displayText = (context, text, x, y, options = {}) => {
  const {
    textAlign = "center",
    textBaseline = "middle",
    fillStyle = DEFAULT_FONT_COLOR,
    font = DEFAULT_FONT,
  } = options;
  context.textAlign = textAlign;
  context.textBaseline = textBaseline;
  context.fillStyle = fillStyle;
  context.font = font;
  context.fillText(text, x, y);
};

const displayScores = (context, score1, x1, y1, score2, x2, y2) => {
  displayText(context, score1, x1, y1, { fillStyle: SCORE_COLOR, font: SCORE_FONT });
  displayText(context, score2, x2, y2, { fillStyle: SCORE_COLOR, font: SCORE_FONT });
  displayText(context, ":", (x1+x2)/2, (y1+y2)/2, { fillStyle: SCORE_COLOR, font: SCORE_FONT });
};

const handleLose = (app) => {
  app.hasLost = true;
  setTimeout(() => {
    Runner.stop(app.runner);
    Render.stop(app.render);
    displayText(app.render.context, NEXT_GAME_TEXT, WIDTH/2, HEIGHT*3/4);
  }, 100);
  app.node.onkeydown = (event) => event.key === " " && start(app);
};

const start = (app) => {
  app.node.innerHTML = "";

  app.engine = Engine.create({
    gravity: { scale: 0, x: 0, y: 0 },
  });
  app.world = app.engine.world;

  app.render = Render.create({
    element: app.node,
    engine: app.engine,
    options: {
      width: WIDTH,
      height: HEIGHT,
      background: "transparent",
      wireframes: false,
    }
  });
  Render.run(app.render);

  app.runner = Runner.create();
  Runner.run(app.runner, app.engine);
  
  app.hasLost = false;
  app.loseZone1 = placeLoseZone(app.world, 0, 0, LOSE_ZONE, WIDTH, HEIGHT);
  app.loseZone2 = placeLoseZone(app.world, WIDTH-LOSE_ZONE, 0, LOSE_ZONE, WIDTH, HEIGHT);
  app.walls = placeWalls(app.world, WIDTH, HEIGHT, WALL_THICKNESS);
  app.ball = placeBall(app.world, WIDTH/2, HEIGHT/2, BALL_RADIUS);
  app.player1 = placePlayer(
    app.world,
    PLAYER1_COLOR,
    WALL_THICKNESS+LOSE_ZONE+PLAYER_SIZE.width/2,
    HEIGHT/2,
    PLAYER_SIZE.width,
    PLAYER_SIZE.height
  );
  app.player2 = placePlayer(
    app.world,
    PLAYER2_COLOR,
    WIDTH-WALL_THICKNESS-LOSE_ZONE-PLAYER_SIZE.width/2,
    HEIGHT/2,
    PLAYER_SIZE.width,
    PLAYER_SIZE.height
  );

  Events.on(app.engine, "beforeUpdate", (event) => {
    Body.setPosition(app.player1, { x: WALL_THICKNESS+LOSE_ZONE+PLAYER_SIZE.width/2, y: app.player1.position.y });
    Body.setPosition(app.player2, { x: WIDTH-WALL_THICKNESS-LOSE_ZONE-PLAYER_SIZE.width/2, y: app.player2.position.y });
    Body.setAngularVelocity(app.player1, 0);
    Body.setAngularVelocity(app.player2, 0);
    Body.setVelocity(app.player1, { x: 0, y: app.player1.velocity.y });
    Body.setVelocity(app.player2, { x: 0, y: app.player2.velocity.y });
    displayScores(app.render.context, app.score1, WIDTH/4+LOSE_ZONE, HEIGHT/2, app.score2, WIDTH*3/4-LOSE_ZONE, HEIGHT/2);
    if (!app.hasLost) {
      displayText(app.render.context, app.isPaused ? RESUME_GAME_TEXT : PAUSE_GAME_TEXT, WIDTH/2, HEIGHT*3/4);
    }
  });

  Events.on(app.engine, "collisionStart", (event) => {
    const { pairs } = event;
    pairs.forEach((pair) => {
      if (pair.collision.collided) {
        const { bodyA, bodyB } = pair;
        if ([bodyA, bodyB].some((body) => body.id === app.ball.id)) {
          // collide with ball
          if ([bodyA, bodyB].some((body) => body.id === app.loseZone1.id)) {
            // ball enters lost zone
            app.score2++;
            handleLose(app);
          } else if ([bodyA, bodyB].some((body) => body.id === app.loseZone2.id)) {
            // ball enters lost zone
            app.score1++;
            handleLose(app);
          }
        }
      }
    });
  });

  Events.on(app.ball, "sleepStart", (event) => app.lastBallVelocity = event.source.velocity);
  Events.on(app.ball, "sleepEnd", (event) => Body.setVelocity(event.source, app.lastBallVelocity));

  app.node.focus();
  app.node.onblur = (event) => app.node.focus();
  app.node.onkeydown = (event) => {
    const { key } = event;
    switch (key) {
      case "ArrowUp": {
        const { position, velocity } = app.player2;
        const { x, y } = position;
        if (Math.abs(velocity.y) < PLAYER_INIT_VELOCITY) {
          Body.setVelocity(app.player2, { x: 0, y: -PLAYER_INIT_VELOCITY });
        }
        break;
      }
      case "ArrowDown": {
        const { position, velocity } = app.player2;
        const { x, y } = position;
        if (Math.abs(velocity.y) < PLAYER_INIT_VELOCITY) {
          Body.setVelocity(app.player2, { x: 0, y: PLAYER_INIT_VELOCITY });
        }
        break;
      }
      case "w":
      case "W": {
        const { position, velocity } = app.player1;
        const { x, y } = position;
        if (Math.abs(velocity.y) < PLAYER_INIT_VELOCITY) {
          Body.setVelocity(app.player1, { x: 0, y: -PLAYER_INIT_VELOCITY });
        }
        break;
      }
      case "s":
      case "S": {
        const { position, velocity } = app.player1;
        const { x, y } = position;
        if (Math.abs(velocity.y) < PLAYER_INIT_VELOCITY) {
          Body.setVelocity(app.player1, { x: 0, y: PLAYER_INIT_VELOCITY });
        }
        break;
      }
      case " ": {
        Sleeping.set(app.ball, !app.isPaused);
        Sleeping.set(app.player1, !app.isPaused);
        Sleeping.set(app.player2, !app.isPaused);
        app.isPaused = !app.isPaused;
        break;
      }
    }
  };
};

const init = (app) => {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  app.node.appendChild(canvas);
  displayText(context, INTRO_TEXT1, WIDTH/2, HEIGHT/4);
  displayText(context, INTRO_TEXT2, WIDTH/2, HEIGHT/2);
  displayText(context, INTRO_TEXT3, WIDTH/2, HEIGHT*3/4);
  app.node.focus();
  app.node.onblur = (event) => app.node.focus();
  app.node.onkeydown = (event) => event.key === " " && start(app);
};

document.addEventListener("DOMContentLoaded", (e) => {
  init(app);
});
