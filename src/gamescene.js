import { Unicycle } from "./unicycle.js";
import { Star } from "./star.js";

export class GameScene extends Phaser.Scene {
  preload() {}

  create() {
    this.matter.world.setBounds();

    this.canJump = false;

    this.score = 0;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
    });

    this.unicycle = new Unicycle(this, 400, 100);

    this.matter.world.add(this.unicycle);

    const group = this.matter.world.nextGroup(true);

    const bridge = this.matter.add.stack(160, 290, 14, 1, 0, 0, (x, y) =>
      Phaser.Physics.Matter.Matter.Bodies.rectangle(x - 20, y, 53, 20, {
        collisionFilter: { group: group },
        label: "rope",
        chamfer: 1,
        density: 0.005,
        frictionAir: 0.01,
        restitution: 1,
      }),
    );

    this.chain = this.matter.add.chain(bridge, 0.3, 0, -0.3, 0, {
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

    setInterval(() => {
      const s = new Star(this, 50 + Math.random() * 700, 10);
    }, 1000);

    this.matter.world.on("collisionactive", (event) => {
      this.canJump = event.pairs.some(
        (pair) => pair.bodyA.label === "wheel" && pair.bodyB.label === "rope",
      );

      for (const pair of event.pairs) {
        if (pair.bodyB.label === "star") {
          if (pair.bodyA.label === "head") {
            this.score++;
          }
          this.matter.world.remove(pair.bodyB);
        }
      }
    });

    this.scoreText = this.add.text(10, 10, "Score: 0", {
      font: "20px Arial",
      fill: "#ffffff", // Text color
    });
  }

  update() {
    const Body = Phaser.Physics.Matter.Matter.Body;

    this.scoreText.setText("Score: " + this.score);

    if (this.keys.left.isDown) {
      Body.setAngularVelocity(this.unicycle.wheel, -0.05);
    } else if (this.keys.right.isDown) {
      Body.setAngularVelocity(this.unicycle.wheel, 0.05);
    }

    if (this.keys.up.isDown && this.canJump) {
      Body.applyForce(this.unicycle.wheel, this.unicycle.wheel.position, {
        x: 0,
        y: -0.1,
      });
      this.canJump = false;
    } else if (this.keys.down.isDown && this.canJump) {
      //this.unicycle.wheel.velocity = { x: 0, y: -10 };
      Body.applyForce(this.unicycle.wheel, this.unicycle.wheel.position, {
        x: 0,
        y: 0.12,
      });
      this.canJump = false;
    }

    if (this.cursors.left.isDown) {
      Body.setAngularVelocity(this.unicycle.frame, -0.01);
    } else if (this.cursors.right.isDown) {
      Body.setAngularVelocity(this.unicycle.frame, 0.01);
    }
  }
}
