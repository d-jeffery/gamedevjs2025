import { GameScene } from "./gamescene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0.8 },
      debug: true,
      debugBodyColor: 0xffffff,
    },
  },
  scene: new GameScene(),
};

const game = new Phaser.Game(config);
