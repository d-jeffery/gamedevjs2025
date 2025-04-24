import Phaser from "phaser";

import { Unicycle } from "./unicycle.js";
import { Fan } from "./fan.js";
import { renderObject } from "./utils.js";

export class GameScene extends Phaser.Scene {
  preload() {
    this.load.audio("theme", ["./assets/Entry_of_Gladiators.mp3"]);
  }

  create() {
    this.matter.world.setBounds(0, -100, 800, 700);

    this.matter.add.mouseSpring();

    this.canJump = false;
    this.airborne = true;
    this.crashed = false;
    this.timeout = undefined;

    this.score = 0;
    this.lives = 3;
    this.width = 800;
    this.height = 600;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      space: "SPACE",
    });

    this.unicycle = new Unicycle(this, 45, 240);

    const group = this.matter.world.nextGroup(true);

    const bridge = this.matter.add.stack(140, 400, 18, 1, 0, 0, (x, y) => {
      return Phaser.Physics.Matter.Matter.Bodies.rectangle(x - 20, y, 52, 25, {
        collisionFilter: { group: group },
        label: "rope",
        chamfer: 1,
      });
    });

    this.fans = [];
    this.renderedChain = [];

    this.chain = this.matter.add.chain(bridge, 0.3, 0, -0.3, 0, {
      label: "bridge",
    });

    this.matter.add.rectangle(0, 500, 160, 250, {
      label: "platform",
      isStatic: true,
      chamfer: { radius: 20 },
    });
    this.matter.add.rectangle(800, 500, 160, 250, {
      label: "platform",
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

    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        this.add.rectangle(80 * i + 40, 300, 80, 600, 0xffff00, 0.25);
      } else {
        this.add.rectangle(80 * i + 40, 300, 80, 600, 0xff0000, 0.25);
      }
    }
    this.add.rectangle(400, 560, 800, 80, 0x351e10, 1);

    // Generate fans
    for (let i = 0; i < 14; i++) {
      const fan = new Fan(this, 75 + 50 * i, 500);
      this.fans.push(fan);
    }
    for (let i = 0; i < 13; i++) {
      const fan = new Fan(this, 100 + 50 * i, 550);
      this.fans.push(fan);
    }

    this.spotlight = this.add.circle(
      this.unicycle.frame.position.x,
      this.unicycle.frame.position.y,
      140,
      0xffff00,
      0.5,
    );

    // Chain ends
    this.add.circle(85, 400, 12, 0x000000, 1).setToTop();
    this.add.circle(715, 400, 12, 0x000000, 1).setToTop();

    this.add.rexRoundRectangle(0, 500, 160, 250, 20, 0x000000, 1);
    this.add.rexRoundRectangle(800, 500, 160, 250, 20, 0x000000, 1);

    this.matter.world.on("collisionstart", (event) => {
      this.crashed = event.pairs.some(
        (pair) =>
          (pair.bodyA.label === "head" && pair.bodyB.label === "rope") ||
          (pair.bodyA.label === "rope" && pair.bodyB.label === "head"),
      );
    });

    this.matter.world.on("collisionactive", (event) => {
      this.canJump = event.pairs.some(
        (pair) =>
          (pair.bodyA.label === "wheel" && pair.bodyB.label === "rope") ||
          (pair.bodyA.label === "rope" && pair.bodyB.label === "wheel"),
      );

      this.airborne = !event.pairs.some(
        (pair) =>
          (pair.bodyA.label === "wheel" &&
            (pair.bodyB.label === "rope" || pair.bodyB.label === "platform")) ||
          ((pair.bodyA.label === "rope" || pair.bodyA.label === "platform") &&
            pair.bodyB.label === "wheel"),
      );
    });

    this.matter.world.on("collisionend", (event) => {
      if (
        event.pairs.some(
          (pair) =>
            (pair.bodyA.label === "wheel" && pair.bodyB.label === "rope") ||
            (pair.bodyA.label === "rope" && pair.bodyB.label === "wheel"),
        )
      ) {
        this.airborne = true;
      }
    });

    let hearts = "";
    for (let i = 0; i < this.lives; i++) {
      hearts = hearts.concat("❤️");
    }

    // this.lifeText = this.add.text(10, 10, hearts, {
    //   font: "34px Arial",
    //   fill: "#ffffff", // Text color
    // });

    this.scoreText = this.add.text(10, 10, "Score: 0", {
      font: "34px Arial",
      fill: "#ffffff", // Text color
    });

    this.draw();

    const music = this.sound.add("theme", {
      volume: 0.25,
      loop: true,
    });
    music.play();
    this.sound.pauseOnBlur = true;
  }

  update(time, delta) {
    const Body = Phaser.Physics.Matter.Matter.Body;

    if (this.airborne) {
      this.score++;
    }

    this.scoreText.setText("Score: " + this.score);
    /* let hearts = "";
    for (let i = 0; i < this.lives; i++) {
      hearts = hearts.concat("❤️");
    }
    this.lifeText.setText(hearts);

    if (this.lives <= 0) {
      this.matter.pause();
      this.add
        .text(this.width / 2, this.height / 3, "Game Over", {
          font: "64px Arial",
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);
      this.add
        .text(this.width / 2, this.height / 2, "'Space' to Play again", {
          font: "32px Arial",
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);

      if (this.keys.space.isDown) {
        this.registry.destroy();
        this.events.off();
        this.scene.restart();
      }
    }*/

    if (this.keys.left.isDown) {
      Body.setAngularVelocity(this.unicycle.wheel, -0.18);
    } else if (this.keys.right.isDown) {
      Body.setAngularVelocity(this.unicycle.wheel, 0.18);
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
        y: 0.05,
      });
      this.canJump = false;
    }

    if (this.cursors.left.isDown) {
      Body.setAngularVelocity(this.unicycle.rider, -0.05);
    } else if (this.cursors.right.isDown) {
      Body.setAngularVelocity(this.unicycle.rider, 0.05);
    }

    this.fans.forEach((fan) => {
      fan.update(time, delta, this.score);
    });

    this.spotlight.setPosition(
      this.unicycle.frame.position.x,
      this.unicycle.frame.position.y,
    );

    this.unicycle.update(time, delta);
    this.draw();
  }

  draw() {
    this.unicycle.draw();

    // Rerender the chain
    this.renderedChain.forEach((chain) => {
      chain.destroy();
    });
    this.renderedChain = [];
    this.chain.bodies.forEach((body) => {
      this.renderedChain.push(renderObject(this, body, 0x000000));
    });
  }
}
