import Phaser from "phaser";

import { Unicycle } from "./unicycle.js";
import { Star } from "./star.js";
import {Fan} from "./fan.js";

export class GameScene extends Phaser.Scene {
  preload() {}

  create() {
    this.matter.world.setBounds();

    // this.matter.add.mouseSpring();

    this.canJump = false;

    this.score = 0;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
    });

    this.unicycle = new Unicycle(this, 45, 275);

    this.matter.world.add(this.unicycle);

    const group = this.matter.world.nextGroup(true);

    const bridge = this.matter.add.stack(140, 400, 14, 1, 0, 0, (x, y) => {
          return Phaser.Physics.Matter.Matter.Bodies.rectangle(x - 20, y, 53, 20, {
            collisionFilter: {group: group},
            label: "rope",
            chamfer: 1,
            density: 0.005,
            restitution: 1,
          });
        }
    );

    this.renderedChain = [];

    this.chain = this.matter.add.chain(bridge, 0.3, 0, -0.3, 0, {
      label: "bridge",
      stiffness: 0.2,
      damping: 0.05,
      length: 0,
    });

    this.pole1 = this.matter.add.rectangle(0, 500, 160, 250, {
      isStatic: true,
      chamfer: { radius: 20 },
    });
    this.pole2 = this.matter.add.rectangle(800, 500, 160, 250, {
      isStatic: true,
      chamfer: { radius: 20 },
    });

    this.matter.add.worldConstraint(bridge.bodies[0], 2, 0.9, {
      pointA: { x: 85, y: 400 },
      pointB: { x: -25, y: 0 },
    });

    this.matter.add.worldConstraint(
      bridge.bodies[bridge.bodies.length - 1],
      2,
      0.9,
      {
        pointA: { x: 715, y: 400 },
        pointB: { x: 25, y: 0 },
      },
    );

    // Generate stars
    setInterval(() => {
      const s = new Star(this, 50 + Math.random() * 700, 10);
    }, 1000);

    // Generate fans
    for (let i = 0; i < 14; i++) {
      new Fan(this, 75+ 50 * i, 500);
    }
    for (let i = 0; i < 13; i++) {
      new Fan(this, 100+ 50 * i, 550);
    }

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

    this.draw()
  }

  update(time, delta) {
    const Body = Phaser.Physics.Matter.Matter.Body;

    this.scoreText.setText("Score: " + this.score);

    if (this.keys.left.isDown) {
      Body.setAngularVelocity(this.unicycle.wheel, -0.05 * delta);
    } else if (this.keys.right.isDown) {
      Body.setAngularVelocity(this.unicycle.wheel, 0.05* delta);
    }

    if (this.keys.up.isDown && this.canJump) {
      Body.applyForce(this.unicycle.wheel, this.unicycle.wheel.position, {
        x: 0,
        y: -0.1,
      });
      this.canJump = false;
    } else if (this.keys.down.isDown && this.canJump) {
      Body.applyForce(this.unicycle.wheel, this.unicycle.wheel.position, {
        x: 0,
        y: 0.12,
      });
      this.canJump = false;
    }

    if (this.cursors.left.isDown) {
      Body.setAngularVelocity(this.unicycle.frame, -0.01 * delta);
    } else if (this.cursors.right.isDown) {
      Body.setAngularVelocity(this.unicycle.frame, 0.01 * delta);
    }

    // Rerender the chain
    this.renderedChain.forEach((chain) => {
      chain.destroy()
    })
    this.renderedChain = [];
    this.chain.bodies.forEach(body => {
      this.renderedChain.push(this.renderObject(body, 0xffffff));
    })

  }

  draw() {
    this.scoreText = this.add.text(10, 10, "Score: 0", {
      font: "20px Arial",
      fill: "#ffffff", // Text color
    });

    this.renderObject(this.pole1, 0xff0000)
    this.renderObject(this.pole2, 0xff0000);

    this.chain.bodies.forEach(body => {
      this.renderedChain.push(this.renderObject(body, 0xffffff));
    })
  }

  renderObject(obj, fillColor ) {
    const graphics = this.add.graphics();

    graphics.fillStyle(fillColor, 1);

    graphics.lineStyle(2, fillColor, 1);

    // Draw the initial shape
    const vertices = obj.vertices;
    graphics.beginPath();
    graphics.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      graphics.lineTo(vertices[i].x, vertices[i].y);
    }
    graphics.closePath();
    graphics.fillPath();

    graphics.body = obj.body

    return graphics;
  }
}
