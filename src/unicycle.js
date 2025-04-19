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

    const head = Bodies.circle(x + width/2, y, 20, {
      label: "head",
      collisionFilter: {
        group: group,
      },
    });

    const frame = Bodies.rectangle(x, y, width, height, {
      label: "frame",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: height * 0.5,
      },
    });

    const wheel = Bodies.circle(x + wheelAOffset, y + wheelYOffset, wheelSize, {
      label: "wheel",
      collisionFilter: {
        group: group,
      },
    });

    const neck = Constraint.create({
      bodyB: head,
      pointA: { x: 50, y: 0 },
      bodyA: frame,
      length: 0,
    });

    const axel = Constraint.create({
      bodyB: frame,
      pointB: { x: wheelAOffset, y: wheelYOffset },
      bodyA: wheel,
      length: 0
    });

    Composite.addBody(cycle, head);
    Composite.addBody(cycle, frame);
    Composite.addBody(cycle, wheel);
    Composite.addConstraint(cycle, axel);
    Composite.addConstraint(cycle, neck);
    Composite.rotate(cycle, Math.PI / 180 * 270, { x: x, y: y });

    scene.matter.world.add(cycle);

    this.cycle = cycle;
    this.frame = frame;
    this.wheel = wheel;
    this.scene = scene;
  }

}
