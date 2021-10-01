import "./index.css";

import Matter from "matter-js";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WALL_THICKNESS = 50;
const BALL_RADIUS = 30;
const PLAYER_SIZE = { width: 50, height: 300 };
const PLAYER_INIT_VELOCITY = 20;
const PLAYER1_COLOR = "red";
const PLAYER2_COLOR = "blue";
const LOST_ZONE = 150;
const SCORE_FONT = "300px Arial";
const SCORE_COLOR = "rgba(0, 0, 0, 0.2)";
const NEXT_GAME_TEXT = "Press \"SPACE\" for next game!";
const NEXT_GAME_COLOR = "rgba(0, 0, 0, 0.4)";
const NEXT_GAME_FONT = "48px Arial";
const INTRO_TEXT1 = "Player 1: WS to move";
const INTRO_TEXT2 = "Player 2: ↑↓ to move";
const INTRO_TEXT3 = "Press \"SPACE\" to start";
const INTRO_COLOR = "rgba(0, 0, 0, 0.4)";
const INTRO_FONT = "48px Arial";

const { Engine, Render, Runner, Composites, Composite, Bodies, Body, Events } = Matter;
const app = {
  node: document.body,
  engine: null,
  world: null,
  render: null,
  runner: null,
  walls: null,
  ball: null,
  lostZone1: null,
  lostZone2: null,
  player1: null,
  player2: null,
  score1: 0,
  score2: 0,
};

const placeWalls = (world, width = WIDTH, height = HEIGHT, thickness = WALL_THICKNESS) => {
  const options = { isStatic: true, render: { sprite: { texture: "wall.png" }}};
  const warningWall = (x, y) => Bodies.rectangle(x, y, thickness, thickness, options);
  const walls = [
    Composites.stack(0, 0, 1, height/thickness, 0, 0, warningWall),
    Composites.stack(width-thickness, 0, 1, height/thickness, 0, 0, warningWall),
    Bodies.rectangle(width/2, thickness/2, width, thickness, { isStatic: true }),
    Bodies.rectangle(width/2, height-thickness/2, width, thickness, { isStatic: true }),
  ];
  Composite.add(world, walls);

  return walls;
};

const placeBall = (world, x = WIDTH/2, y = HEIGHT/2, radius = BALL_RADIUS) => {
  const randomForceX = (Math.random() >= 0.5 ? 1 : -1) * (0.15 + Math.random()/10);
  const randomForceY = (Math.random() >= 0.5 ? 1 : -1) * Math.random()/6;
  const ball = Bodies.circle(x, y, radius, {
    density: 0.005,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 1,
    inertia: Infinity,
    force: { x: randomForceX, y: randomForceY },
    render: {
      sprite: {
        texture: "./ball.png",
      }
    }
  });
  Composite.add(world, [ball]);

  return ball;
};

const placeLostZone = (world, x, y, zone = LOST_ZONE, width = WIDTH, height = HEIGHT) => {
  const options = { isStatic: true, isSensor: true, render: { fillStyle: "transparent" }};
  const lostZone = Bodies.rectangle(x+zone/2, y+height/2, zone, height, options);
  Composite.add(world, [lostZone]);

  return lostZone;
};

const placePlayer = (world, color, x, y, width = PLAYER_SIZE.width, height = PLAYER_SIZE.height) => {
  const player = Bodies.rectangle(x, y, width, height, { density: 1, frictionAir: 0.1, render: { fillStyle: color }});
  Composite.add(world, [player]);

  return player;
};

const displayText = (context, text, x, y, options) => {
  const {
    textAlign = "center",
    textBaseline = "middle",
    fillStyle,
    font
  } = options;
  context.textAlign = textAlign;
  context.textBaseline = textBaseline;
  context.fillStyle = fillStyle || context.fillStyle;
  context.font = font || context.font;
  context.fillText(text, x, y);
};

const displayScores = (context, score1, x1, y1, score2, x2, y2) => {
  displayText(context, score1, x1, y1, { fillStyle: SCORE_COLOR, font: SCORE_FONT });
  displayText(context, score2, x2, y2, { fillStyle: SCORE_COLOR, font: SCORE_FONT });
  displayText(context, ":", (x1+x2)/2, (y1+y2)/2, { fillStyle: SCORE_COLOR, font: SCORE_FONT });
};

const handleLose = (app) => {
  setTimeout(() => {
    Runner.stop(app.runner);
    Render.stop(app.render);
    displayText(app.render.context, NEXT_GAME_TEXT, WIDTH/2, HEIGHT*3/4, { fillStyle: NEXT_GAME_COLOR, font: NEXT_GAME_FONT });
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
  
  app.lostZone1 = placeLostZone(app.world, 0, 0);
  app.lostZone2 = placeLostZone(app.world, WIDTH-LOST_ZONE, 0);
  app.walls = placeWalls(app.world);
  app.ball = placeBall(app.world);
  app.player1 = placePlayer(app.world, PLAYER1_COLOR, WALL_THICKNESS+LOST_ZONE+PLAYER_SIZE.width/2, HEIGHT/2);
  app.player2 = placePlayer(app.world, PLAYER2_COLOR, WIDTH-WALL_THICKNESS-LOST_ZONE-PLAYER_SIZE.width/2, HEIGHT/2);

  Events.on(app.engine, "beforeUpdate", (event) => {
    Body.setPosition(app.player1, { x: WALL_THICKNESS+LOST_ZONE+PLAYER_SIZE.width/2, y: app.player1.position.y });
    Body.setPosition(app.player2, { x: WIDTH-WALL_THICKNESS-LOST_ZONE-PLAYER_SIZE.width/2, y: app.player2.position.y });
    Body.setAngularVelocity(app.player1, 0);
    Body.setAngularVelocity(app.player2, 0);
    Body.setVelocity(app.player1, { x: 0, y: app.player1.velocity.y });
    Body.setVelocity(app.player2, { x: 0, y: app.player2.velocity.y });
    displayScores(app.render.context, app.score1, WIDTH/4+LOST_ZONE, HEIGHT/2, app.score2, WIDTH*3/4-LOST_ZONE, HEIGHT/2);
  });

  Events.on(app.engine, "collisionStart", (event) => {
    const { pairs } = event;
    pairs.forEach((pair) => {
      if (pair.collision.collided) {
        const { bodyA, bodyB } = pair;
        if ([bodyA, bodyB].some((body) => body.id === app.ball.id)) {
          // collide with ball
          if ([bodyA, bodyB].some((body) => body.id === app.lostZone1.id)) {
            // ball enters lost zone
            app.score2++;
            handleLose(app);
          } else if ([bodyA, bodyB].some((body) => body.id === app.lostZone2.id)) {
            // ball enters lost zone
            app.score1++;
            handleLose(app);
          }
        }
      }
    });
  });

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
    }
  };
};

const init = (app) => {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  app.node.appendChild(canvas);
  const textOptions = { fillStyle: INTRO_COLOR, font: INTRO_FONT };
  displayText(context, INTRO_TEXT1, WIDTH/2, HEIGHT/4, textOptions);
  displayText(context, INTRO_TEXT2, WIDTH/2, HEIGHT/2, textOptions);
  displayText(context, INTRO_TEXT3, WIDTH/2, HEIGHT*3/4, textOptions);
  app.node.focus();
  app.node.onblur = (event) => app.node.focus();
  app.node.onkeydown = (event) => event.key === " " && start(app);
};

document.addEventListener("DOMContentLoaded", (e) => {
  init(app);
});
