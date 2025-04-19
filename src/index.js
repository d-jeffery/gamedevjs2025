import Phaser from "phaser";
import { GameScene } from "./gamescene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1.0 },
      //debug: true,
      debugBodyColor: 0xffffff,
    },
  },
  scene: new GameScene(),
};

const game = new Phaser.Game(config);
