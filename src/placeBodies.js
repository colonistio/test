import Matter from "matter-js";

const { Composites, Composite, Bodies } = Matter;

export const placeWalls = (world, width, height, thickness) => {
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

export const placeBall = (world, x, y, radius) => {
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

export const placeLoseZone = (world, x, y, zone, width, height) => {
  const options = { isStatic: true, isSensor: true, render: { fillStyle: "transparent" }};
  const lostZone = Bodies.rectangle(x+zone/2, y+height/2, zone, height, options);
  Composite.add(world, [lostZone]);

  return lostZone;
};

export const placePlayer = (world, color, x, y, width, height) => {
  const player = Bodies.rectangle(x, y, width, height, { density: 1, frictionAir: 0.1, render: { fillStyle: color }});
  Composite.add(world, [player]);

  return player;
};
