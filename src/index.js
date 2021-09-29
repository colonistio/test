import "./index.css";

import Matter from "matter-js";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WALL_THICKNESS = 50;
const BALL_RADIUS = 30;
const PLAYER_SIZE = { width: 50, height: 300 };
const LOST_ZONE = 150;

const { Engine, Render, Runner, Composite, Bodies, Body, Events } = Matter;
const app = {
  walls: null,
  ball: null,
  lostZone1: null,
  lostZone2: null,
  player1: null,
  player2: null,
  score1: 0,
  score2: 0,
};

const placeWall = (x, y, width, height, thickness) => {
  const option = { isStatic: true, mass: 100, render: { sprite: { texture: "wall.png" }}};
  const parts = [];
  for (let i=0; i<width; i+=thickness) {
    for (let j=0; j<height; j+=thickness) {
      parts.push(Bodies.rectangle(x+i+thickness/2, y+j+thickness/2, thickness, thickness, option));
    }
  }
  return Bodies.rectangle(x+width/2, y+height/2, width, height, {
    isStatic: true,
    parts,
  });
};

const placeWalls = (world, width = WIDTH, height = HEIGHT, thickness = WALL_THICKNESS) => {
  const walls = [
    placeWall(0, 0, thickness, height, thickness),
    placeWall(width-thickness, 0, thickness, height, thickness),
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
  const option = { isStatic: true, isSensor: true, render: { fillStyle: "transparent" }};
  const lostZone = Bodies.rectangle(x+zone/2, y+height/2, zone, height, option);
  Composite.add(world, [lostZone]);

  return lostZone;
};

const placePlayer = (world, x, y, width = PLAYER_SIZE.width, height = PLAYER_SIZE.height) => {
  const player = Bodies.rectangle(x, y, width, height, { density: 1 });
  Composite.add(world, [player]);

  return player;
};

const init = () => {
  const engine = Engine.create({
    gravity: { scale: 0, x: 0, y: 0 },
  });
  const world = engine.world;

  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: WIDTH,
      height: HEIGHT,
      background: "white",
      wireframes: false,
    }
  });
  Render.run(render);

  const runner = Runner.create();
  Runner.run(runner, engine);

  app.lostZone1 = placeLostZone(world, 0, 0);
  app.lostZone2 = placeLostZone(world, WIDTH-LOST_ZONE, 0);
  app.walls = placeWalls(world);
  app.ball = placeBall(world);
  app.player1 = placePlayer(world, WALL_THICKNESS+LOST_ZONE+PLAYER_SIZE.width/2, HEIGHT/2);
  app.player2 = placePlayer(world, WIDTH-WALL_THICKNESS-LOST_ZONE-PLAYER_SIZE.width/2, HEIGHT/2);

  Events.on(engine, "beforeUpdate", (event) => {
    Body.setPosition(app.player1, { x: WALL_THICKNESS+LOST_ZONE+PLAYER_SIZE.width/2, y: app.player1.position.y });
    Body.setPosition(app.player2, { x: WIDTH-WALL_THICKNESS-LOST_ZONE-PLAYER_SIZE.width/2, y: app.player2.position.y });
    Body.setAngularVelocity(app.player1, 0);
    Body.setAngularVelocity(app.player2, 0);
    Body.setVelocity(app.player1, { x: 0, y: app.player1.velocity.y });
    Body.setVelocity(app.player2, { x: 0, y: app.player2.velocity.y });
  });

  Events.on(engine, "collisionStart", (event) => {
    const { pairs } = event;
    pairs.forEach((pair) => {
      if (pair.collision.collided) {
        const { bodyA, bodyB } = pair;
        if ([bodyA, bodyB].some((body) => body.id === app.ball.id)) {
          // collide with ball
          if ([bodyA, bodyB].some((body) => body.id === app.lostZone1.id)) {
            // ball enters lost zone
            Runner.stop(runner);
          } else if ([bodyA, bodyB].some((body) => body.id === app.lostZone2.id)) {
            // ball enters lost zone
            Runner.stop(runner);
          }
        }
      }
    });
  });

  document.body.focus();
  document.body.onblur = (event) => document.body.focus();
  document.body.onkeydown = (event) => {
    const { key } = event;
    switch (key) {
      case "ArrowUp": {
        const { x, y } = app.player2.position;
        Body.applyForce(app.player2, { x, y }, { x: 0, y: -50 });
        break;
      }
      case "ArrowDown": {
        const { x, y } = app.player2.position;
        Body.applyForce(app.player2, { x, y }, { x: 0, y: 50 });
        break;
      }
      case "w":
      case "W": {
        const { x, y } = app.player1.position;
        Body.applyForce(app.player1, { x, y }, { x: 0, y: -50 });
        break;
      }
      case "s":
      case "S": {
        const { x, y } = app.player1.position;
        Body.applyForce(app.player1, { x, y }, { x: 0, y: 50 });
        break;
      }
    }
  };
};

document.addEventListener("DOMContentLoaded", (e) => {
  init();
});
