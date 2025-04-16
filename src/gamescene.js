import { Unicycle } from "./unicycle.js";

export class GameScene extends Phaser.Scene {
  preload() {}

  create() {
    this.matter.world.setBounds();

    this.matter.add.mouseSpring();

    this.canJump = false;

    this.unicycle = new Unicycle(this, 400, 100);

    this.matter.world.add(this.unicycle);

    const group = this.matter.world.nextGroup(true);

    const bridge = this.matter.add.stack(160, 290, 14, 1, 0, 0, (x, y) =>
      Phaser.Physics.Matter.Matter.Bodies.rectangle(x - 20, y, 53, 30, {
        collisionFilter: { group: group },
        label: "rope",
        chamfer: 5,
        density: 0.005,
        frictionAir: 0.01,
        restitution: 0.85,
        // restitutionAir: 0.5,
      }),
    );

    this.matter.add.chain(bridge, 0.3, 0, -0.3, 0, {
      label: "bridge",
      stiffness: 0.2,
      damping: 0.05,
      length: 0,
      render: {
        visible: true,
      },
    });

    this.matter.add.rectangle(0, 500, 160, 250, {
      isStatic: true,
      chamfer: { radius: 20 },
    });
    this.matter.add.rectangle(800, 500, 160, 250, {
      isStatic: true,
      chamfer: { radius: 20 },
    });
    this.matter.add.worldConstraint(bridge.bodies[0], 2, 0.9, {
      pointA: { x: 80, y: 400 },
      pointB: { x: -25, y: 0 },
    });

    this.matter.add.worldConstraint(
      bridge.bodies[bridge.bodies.length - 1],
      2,
      0.9,
      {
        pointA: { x: 720, y: 400 },
        pointB: { x: 25, y: 0 },
      },
    );

    this.matter.world.on("collisionactive", (event) => {
      if (
        event.pairs.some(
          (pair) => pair.bodyA.label === "wheel" && pair.bodyB.label === "rope",
        )
      ) {
        this.canJump = true;
      }
    });
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
    } else if (keys.down.isDown && this.canJump) {
      this.unicycle.wheel.force = {
        x: 0,
        y: 0.25,
      };
      this.canJump = false;
    }

    if (cursors.left.isDown) {
      this.unicycle.frame.torque = -0.1;
    } else if (cursors.right.isDown) {
      this.unicycle.frame.torque = 0.1;
    }
  }
}
