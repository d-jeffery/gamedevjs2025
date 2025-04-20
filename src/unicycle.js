import { renderObject, renderObjectStroke } from "./utils.js";

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

    this.graphics = [];

    const head = scene.matter.add.circle(x, y, 15, {
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

    const seat = scene.matter.add.rectangle(x - 10, y, 15, 40, {
      label: "seat",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: height * 0.5,
      },
    });

    const body = scene.matter.add.rectangle(x + 40, y, 60, 40, {
      label: "body",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: 20,
      },
    });

    const wheel = scene.matter.add.circle(
      x + wheelAOffset,
      y + wheelYOffset,
      wheelSize,
      {
        label: "wheel",
        collisionFilter: {
          group: group,
        },
      },
    );

    const neck = scene.matter.add.constraint(frame, head, 0, 0, {
      pointA: { x: 60, y: 0 },
    });

    const axel = scene.matter.add.constraint(wheel, frame, 0, 0, {
      pointB: { x: wheelAOffset, y: wheelYOffset },
    });

    const chest = scene.matter.add.constraint(frame, body, 0, 0, {
      pointA: { x: 20, y: 0 },
    });

    const seatBolt = scene.matter.add.constraint(frame, seat, 0, 0, {
      pointB: { x: 15, y: 0 },
    });

    const cycle = scene.matter.composite.create({
      label: "cycle",
      bodies: [head, body, frame, wheel, seat],
      constraints: [neck, axel, chest, seatBolt],
    });

    Composite.rotate(cycle, (Math.PI / 180) * 270, { x: x, y: y });

    this.cycle = cycle;
    this.head = head;
    this.body = body;
    this.frame = frame;
    this.seat = seat;
    this.wheel = wheel;
    this.scene = scene;
  }

  update(time, delta) {
    this.body.inverseInertia = 0;
    this.body.inertia = Infinity;
    this.body.angle = this.frame.angle;

    this.seat.inverseInertia = 0;
    this.seat.inertia = Infinity;
    this.seat.angle = this.frame.angle;
  }

  draw() {
    const color = 0x000000;

    this.graphics.forEach((cycle) => {
      cycle.destroy();
    });

    this.graphics.push(renderObject(this.scene, this.head, color));
    this.graphics.push(renderObject(this.scene, this.body, color));
    this.graphics.push(renderObject(this.scene, this.frame, color));
    this.graphics.push(renderObject(this.scene, this.seat, color));
    this.graphics.push(renderObjectStroke(this.scene, this.wheel, color, 10));
    // this.graphics.push(renderWheel(this.scene, this.wheel, color, 10));
  }
}
