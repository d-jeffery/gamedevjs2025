export function renderObject(scene, obj, fillColor) {
  const graphics = scene.add.graphics();

  graphics.fillStyle(fillColor, 1);

  graphics.lineStyle(2, fillColor, 1);

  // Draw the initial shape
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

  // Draw the initial shape
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

//
// export function renderWheel(scene, obj, strokeColor, linewidth) {
//   const graphics = scene.add.graphics();
//
//   // Set the wheel's properties
//   const centerX = 400; // X-coordinate of the wheel's center
//   const centerY = 300; // Y-coordinate of the wheel's center
//   const radius = 100; // Radius of the wheel
//   const spokeCount = 8; // Number of spokes
//
//   // Draw the outer circle
//   graphics.lineStyle(linewidth, strokeColor, 1); // Black outline
//   graphics.strokeCircle(centerX, centerY, radius);
//
//   // Draw the spokes
//   for (let i = 0; i < spokeCount; i++) {
//     const angle = (i * Math.PI * 2) / spokeCount;
//     const x = centerX + Math.cos(angle) * radius;
//     const y = centerY + Math.sin(angle) * radius;
//
//     graphics.lineBetween(centerX, centerY, x, y);
//   }
//
//   return graphics;
// }
