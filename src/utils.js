const Composite = Phaser.Physics.Matter.Matter.Composite;
const Query = Phaser.Physics.Matter.Matter.Query;

export function renderObject(scene, obj, fillColor) {
  const graphics = scene.add.graphics();

  graphics.fillStyle(fillColor, 1);

  graphics.lineStyle(2, fillColor, 1);

  const vertices = obj.vertices;
  graphics.beginPath();
  graphics.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    graphics.lineTo(vertices[i].x, vertices[i].y);
  }
  graphics.closePath();
  graphics.fillPath();

  graphics.body = obj.body;

  return graphics;
}

export function renderObjectStroke(scene, obj, strokeColor, linewidth) {
  const graphics = scene.add.graphics();

  graphics.lineStyle(linewidth, strokeColor, 1);

  const vertices = obj.vertices;
  graphics.beginPath();
  graphics.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    graphics.lineTo(vertices[i].x, vertices[i].y);
  }
  graphics.closePath();
  graphics.strokePath();

  return graphics;
}
