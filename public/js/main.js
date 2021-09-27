
app.onInit = () => {
  const redBox = {
    id: "red-box",
    x: 100,
    y: 0,
    width: 100,
    height: 100,
    color: "red",
    direction: 0,
  };
  const blackBox = {
    id: "black-box",
    x: 50,
    y: 0,
    width: 150,
    height: 150,
    color: "black",
  };
  app.nodes.push(redBox);
  app.nodes.push(blackBox);
};

app.onUpdate = (time) => {
  const redBox = app.getNode("red-box");
  const blackBox = app.getNode("black-box");

  blackBox.y++;
  redBox.direction = Math.cos(app.timestamp/100) > 0 ? -1 : 1; 
  redBox.x += redBox.direction;
};
