export class Unicycle {
  constructor(scene, x, y) {
    const Body = Phaser.Physics.Matter.Matter.Body;
    const Bodies = Phaser.Physics.Matter.Matter.Bodies;
    const Composite = Phaser.Physics.Matter.Matter.Composite;
    const Constraint = Phaser.Physics.Matter.Matter.Constraint;

    const width = 100;
    const height = 20;
    const wheelSize = 30;

    const group = Body.nextGroup(true);
    const wheelBase = 10;
    const wheelAOffset = -width * 0.5 + wheelBase;
    const wheelYOffset = 0;

    const cycle = Composite.create({ label: "cycle" });

    const head = Bodies.circle(x, y - 100, 20, {
      label: "head",
      collisionFilter: {
        group: group,
      },
      density: 0.0005,
      mass: 0,
    });

    const frame = Bodies.rectangle(x, y, width, height, {
      label: "frame",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: height * 0.5,
      },
      density: 0.0005,
      mass: 0,
      restitution: 0.5,
    });

    const wheel = Bodies.circle(x + wheelAOffset, y + wheelYOffset, wheelSize, {
      label: "wheel",
      collisionFilter: {
        group: group,
      },
      friction: 0.5,
    });

    const neck = Constraint.create({
      bodyB: head,
      pointA: { x: 50, y: 0 },
      bodyA: frame,
      angularStiffness: 1,
      stiffness: 1,
      length: 0,
    });

    const axel = Constraint.create({
      bodyB: frame,
      pointB: { x: wheelAOffset, y: wheelYOffset },
      bodyA: wheel,
      angularStiffness: 0.9,
      stiffness: 1,
      length: 0,
    });

    Composite.addBody(cycle, head);
    Composite.addBody(cycle, frame);
    Composite.addBody(cycle, wheel);
    Composite.addConstraint(cycle, axel);
    Composite.addConstraint(cycle, neck);

    scene.matter.world.add(cycle);

    this.cycle = cycle;
    this.frame = frame;
    this.wheel = wheel;
    this.scene = scene;

    /*const group = scene.matter.world.nextGroup(true);

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
     */
  }
}
