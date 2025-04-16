export class Unicycle {
  constructor(scene, x, y) {
    const group = scene.matter.world.nextGroup(true);

    this.wheel = scene.matter.add.circle(x, y, 30, {
      collisionFilter: { group: group },
      label: "wheel",
      density: 0.005,
      friction: 1,
      restitution: 0.8,
    });

    this.head = scene.matter.add.circle(x, y - 100, 20, {
      collisionFilter: { group: group },
      density: 0.001,
      friction: 1,
      restitution: 0.8,
    });

    this.frame = scene.matter.add.rectangle(x, y - 50, 10, 100, {
      collisionFilter: { group: group },
      chamfer: 5,
      density: 0.01,
      friction: 1,
      restitution: 0.5,
    });

    scene.matter.add.constraint(this.wheel, this.frame, 0, 0, {
      angularStiffness: 0.9,
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: 50 },
    });

    scene.matter.add.constraint(this.head, this.frame, 0, 0, {
      angularStiffness: 1,
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: -50 },
    });

    // this.compoundBody = Phaser.Physics.Matter.Matter.Body.create({
    //   parts: [this.head, this.frame, this.wheel],
    // });

    this.scene = scene;
  }
}
