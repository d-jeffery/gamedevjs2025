export class Unicycle {
  constructor(scene, x, y) {

    const Body = Phaser.Physics.Matter.Matter.Body;
    const Composite = Phaser.Physics.Matter.Matter.Composite;

    const width = 140;
    const height = 10;
    const wheelSize = 30;

    const group = Body.nextGroup(true);
    const wheelAOffset = -width * 0.5;
    const wheelYOffset = 0;

    const head = scene.matter.add.circle(x, y, 20, {
      label: "head",
      collisionFilter: {
        group: group,
      },
    });

    const frame = scene.matter.add.rectangle(x, y, width, height, {
        label: "frame",
        collisionFilter: {
            group: group,
        },
        chamfer: {
            radius: height * 0.5,
        },
    });

    const wheel = scene.matter.add.circle(x + wheelAOffset, y + wheelYOffset, wheelSize, {
        label: "wheel",
        collisionFilter: {
            group: group,
        },
    });

    const neck = scene.matter.add.constraint(frame, head, 0, 0, {
        pointA: { x: 60, y: 0 },
        length: 0,
    })

    const axel = scene.matter.add.constraint(wheel, frame, 0, 0, {
      pointB: { x: wheelAOffset, y: wheelYOffset },
      length: 0
    })

    const cycle = scene.matter.composite.create({
        label: "cycle",
        bodies:[head, frame, wheel],
        constraints: [neck, axel],

    });

      Composite.rotate(cycle, Math.PI / 180 * 270, { x: x, y: y });

      this.cycle = cycle;
      this.frame = frame;
      this.wheel = wheel;
      this.scene = scene;
  }
}
