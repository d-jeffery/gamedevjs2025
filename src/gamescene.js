import { Unicycle } from "./unicycle.js";

export class GameScene extends Phaser.Scene {
  preload() {}

  create() {
    this.matter.world.setBounds();

    this.matter.add.mouseSpring();

    this.unicycle = new Unicycle(this, 400, 100);

    this.matter.world.add(this.unicycle);

    //const rider = this.matter.add.car(400, 10, 80, 20, 20);

    const group = this.matter.world.nextGroup(true);

    const bridge = this.matter.add.stack(160, 290, 15, 1, 0, 0, (x, y) =>
      Phaser.Physics.Matter.Matter.Bodies.rectangle(x - 20, y, 53, 20, {
        collisionFilter: { group: group },
        chamfer: 5,
        density: 0.005,
        frictionAir: 0.05,
      }),
    );

    this.matter.add.chain(bridge, 0.3, 0, -0.3, 0, {
      stiffness: 0.5,
      length: 0,
      render: {
        visible: false,
      },
    });

    /*const stack = this.matter.add.stack(250, 50, 6, 3, 0, 0, (x, y) =>
      Phaser.Physics.Matter.Matter.Bodies.rectangle(
        x,
        y,
        50,
        50,
        Phaser.Math.Between(20, 40),
      ),
    );*/

    this.matter.add.rectangle(30, 490, 220, 380, {
      isStatic: true,
      chamfer: { radius: 20 },
    }),
      this.matter.add.rectangle(770, 490, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 },
      }),
      this.matter.add.worldConstraint(bridge.bodies[0], 2, 0.9, {
        pointA: { x: 140, y: 300 },
        pointB: { x: -25, y: 0 },
      });

    this.matter.add.worldConstraint(
      bridge.bodies[bridge.bodies.length - 1],
      2,
      0.9,
      {
        pointA: { x: 660, y: 300 },
        pointB: { x: 25, y: 0 },
      },
    );
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
    });

    if (keys.left.isDown) {
      this.unicycle.wheel.torque = -0.2;
    } else if (keys.right.isDown) {
      this.unicycle.wheel.torque = 0.2;
    }

    if (keys.up.isDown) {
    } else if (keys.down.isDown) {
      this.unicycle.wheel.force = { x: this.unicycle.wheel.force.x, y: 0.2 };
    }

    if (cursors.left.isDown) {
      this.unicycle.frame.torque = -0.1;
    } else if (cursors.right.isDown) {
      this.unicycle.frame.torque = 0.1;
    }
  }
}
