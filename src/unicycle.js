import { renderObject, renderObjectStroke } from "./utils.js";

const Body = Phaser.Physics.Matter.Matter.Body;
const Bodies = Phaser.Physics.Matter.Matter.Bodies;
const Composite = Phaser.Physics.Matter.Matter.Composite;
const Constraint = Phaser.Physics.Matter.Matter.Constraint;

export class Unicycle {
  constructor(scene, x, y) {
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

    // scene.matter.world.add(rider);

    /*
    const head = scene.matter.add.circle(x - 40, y, 15, {
      label: "head",
      collisionFilter: {
        group: group,
      },
    });

    const body = scene.matter.add.rectangle(x, y, 60, 40, {
      label: "body",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: 20,
      },
    });

    const frame = scene.matter.add.rectangle(x, y, 140, 10, {
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
    this.seat = seat;*/
    this.head = head;
    this.body = body;
    this.seat = seat;
    this.pole = pole;
    this.frame = frame;
    this.wheel = wheel;
    this.cycle = cycle;
    this.scene = scene;
  }

  update(time, delta) {
    // this.body.inverseInertia = 0;
    // this.body.inertia = Infinity;
    // this.body.angle = this.frame.angle;
    //
    // this.seat.inverseInertia = 0;
    // this.seat.inertia = Infinity;
    // this.seat.angle = this.frame.angle;
  }

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
    // this.graphics.push(renderWheel(this.scene, this.wheel, color, 10));
  }
}

/*
    const head = scene.matter.add.circle(x, y, 15, {
      label: "head",
      collisionFilter: {
        group: group,
      },
    });

    const body = scene.matter.add.rectangle(x, y + 40, 40, 60, {
      label: "body",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: 20,
      },
    });

    const neck = scene.matter.add.constraint(head, body, 40, 1, {
      pointA: { x: 0, y: 0 },
      pointB: { x: -10, y: 0 },
      angularStiffness: 1,
    });

    const neck2 = scene.matter.add.constraint(head, body, 40, 1, {
      pointA: { x: 0, y: 0 },
      pointB: { x: 10, y: 0 },
      angularStiffness: 1,
    });

    const frame = scene.matter.add.rectangle(x, y, 10, 120, {
      label: "frame",
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: height * 0.5,
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

    const axel = scene.matter.add.constraint(frame, wheel, 0, 0, {
      pointA: { x: 0, y: 60 },
      angularStiffness: 0,
    });

    const cycle = scene.matter.composite.create({
      label: "cycle",
      bodies: [head, body, frame, wheel],
      constraints: [neck, neck2, axel],
    });*/
