import Phaser from "phaser";

import { Unicycle } from "./unicycle.js";
import { Fan } from "./fan.js";
import { renderObject } from "./utils.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.fans = [];
    data.fans.forEach((fan) => {
      const newFan = new Fan(this, fan.x, fan.y);
      newFan.shirt = fan.shirt;
      newFan.skin = fan.skin;
      newFan.graphic;
      this.fans.push(newFan);
    });

    this.music = data.music;
  }

  preload() {}

  create() {
    this.matter.world.setBounds(0, -100, 800, 700);

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.input.keyboard.on("keydown-M", () => {
      this.music.mute = !this.music.mute;
    });

    // this.matter.add.mouseSpring();

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

    this.add.rectangle(400, 560, 800, 80, 0x351e10, 1).setToBack();

    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        this.add
          .rectangle(80 * i + 40, 300, 80, 600, 0xffff00, 0.25)
          .setToBack();
      } else {
        this.add
          .rectangle(80 * i + 40, 300, 80, 600, 0xff0000, 0.25)
          .setToBack();
      }
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

    this.lifeText = this.add.text(10, 10, hearts, {
      font: "34px Arial",
      fill: "#ffffff", // Text color
    });

    this.scoreText = this.add.text(10, 10, "Score: 0", {
      font: "34px Arial",
      fill: "#ffffff", // Text color
    });

    this.draw();
  }

  update(time, delta) {
    const Body = Phaser.Physics.Matter.Matter.Body;

    if (this.airborne) {
      this.score++;
    }

    if (this.crashed) {
      this.score -= 500;
      this.lives--;
      this.crashed = false;
      if (this.score < 0) {
        this.score = 0;
      }
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

    this.scoreText.setText("Score: " + this.score);
    let hearts = "";
    for (let i = 0; i < this.lives; i++) {
      hearts = hearts.concat("❤️");
    }
    this.lifeText.setText(hearts);

    if (this.lives <= 0) {
      this.add
        .text(this.width / 2, this.height / 3, "Game Over", {
          fontFamily: "awesome",
          fontSize: 64,
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);
      this.add
        .text(this.width / 2, this.height / 2, "'Space' to Play again", {
          fontFamily: "awesome",
          fontSize: 64,
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);

      if (this.keys.space.isDown) {
        this.scene.restart({ fans: this.fans, music: this.music });
      }
      return;
    }

    // Handle controls
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
