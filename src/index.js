import Phaser from "phaser";
import RoundRectanglePlugin from "phaser3-rex-plugins/plugins/roundrectangle-plugin.js";

import { GameScene } from "./gamescene.js";
import { MenuScene } from "./menuscene.js";
import { HelpScene } from "./helpscene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1.0 },
      // debug: true,
      debugBodyColor: 0xffffff,
    },
  },
  plugins: {
    global: [
      {
        key: "rexRoundRectanglePlugin",
        plugin: RoundRectanglePlugin,
        start: true,
      },
    ],
  },
  scene: [MenuScene, HelpScene, GameScene],
};

const game = new Phaser.Game(config);
