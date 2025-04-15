export class Unicycle {
  constructor(scene, x, y) {
    const group = scene.matter.world.nextGroup(true);

    this.wheel = scene.matter.add.circle(x, y, 20, {
      collisionFilter: { group: group },
      label: "wheel",
      density: 0.01,
      friction: 0.8,
      restitution: 0.5,
    });

    // this.head = scene.matter.add.circle(x, y, 20, {
    //   collisionFilter: { group: group },
    //   density: 0.01,
    //   friction: 0.8,
    //   restitution: 0.5,
    // });

    this.frame = scene.matter.add.rectangle(x, y - 50, 10, 100, {
      collisionFilter: { group: group },
      chamfer: 5,
      density: 0.01,
      friction: 0,
      restitution: 0.5,
    });

    this.constraint = scene.matter.add.constraint(
      this.wheel,
      this.frame,
      0,
      0,
      {
        angularStiffness: 0.9,
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 50 },
      },
    );

    // scene.matter.add.constraint(this.frame, this.head, 0, 0, {
    //   pointA: { x: 0, y: 0 },
    //   pointB: { x: 0, y: 0 },
    // });

    this.scene = scene;
  }
}
