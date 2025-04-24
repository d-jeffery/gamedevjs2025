import { renderObject, renderObjectStroke } from "./utils.js";

const Body = Phaser.Physics.Matter.Matter.Body;
const Bodies = Phaser.Physics.Matter.Matter.Bodies;
const Composite = Phaser.Physics.Matter.Matter.Composite;
const Constraint = Phaser.Physics.Matter.Matter.Constraint;

export class Unicycle {
  constructor(scene, x, y) {
    this.dead = false;

    const width = 140;
    const height = 10;
    const wheelSize = 30;

    const group = Body.nextGroup(true);

    this.graphics = [];

    const head = Bodies.circle(x, y - 40, 15, {
      label: "head",
      collisionFilter: {
        group: group,
      },
    });

    const body = Bodies.rectangle(x, y, 40, 60, {
      label: "body",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: 20,
      },
    });

    const rider = Body.create({
      label: "rider",
      collisionFilter: {
        group: group,
      },
      parts: [head, body],
    });

    const pole = Bodies.rectangle(x, y + 80, 10, 80, {
      label: "pole",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: height * 0.5,
      },
    });

    const seat = Bodies.rectangle(x, y + 40, 40, 10, {
      label: "seat",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: height * 0.5,
      },
    });

    const frame = Body.create({
      parts: [pole, seat],
      collisionFilter: {
        group: group,
      },
    });

    const wheel = Bodies.circle(x, y + 120, wheelSize, {
      label: "wheel",
      collisionFilter: {
        group: group,
      },
    });

    const axel = Constraint.create({
      bodyA: frame,
      bodyB: wheel,
      pointA: { x: 0, y: 50 },
      length: 0,
    });

    const neck = Constraint.create({
      bodyA: rider,
      bodyB: frame,
      pointA: { x: -10, y: 40 },
      pointB: { x: -10, y: -30 },
      length: 0,
    });

    const neck2 = Constraint.create({
      bodyA: rider,
      bodyB: frame,
      pointA: { x: 10, y: 40 },
      pointB: { x: 10, y: -30 },
      length: 0,
    });

    const cycle = Composite.create({
      label: "cycle",
      bodies: [rider, frame, wheel],
      constraints: [axel, neck, neck2],
    });

    scene.matter.world.add(cycle);

    this.head = head;
    this.body = body;
    this.rider = rider;
    this.seat = seat;
    this.pole = pole;
    this.frame = frame;
    this.wheel = wheel;
    this.cycle = cycle;
    this.scene = scene;
  }

  update(time, delta) {}

  draw() {
    const color = 0x000000;

    this.graphics.forEach((g) => {
      g.destroy();
    });

    this.graphics.push(renderObject(this.scene, this.head, color));
    this.graphics.push(renderObject(this.scene, this.body, color));
    this.graphics.push(renderObject(this.scene, this.seat, color));
    this.graphics.push(renderObject(this.scene, this.pole, color));
    this.graphics.push(renderObjectStroke(this.scene, this.wheel, color, 10));
  }
}
