import Phaser from "phaser";
import { Fan } from "./fan.js";

export class HelpScene extends Phaser.Scene {
  constructor() {
    super({ key: "HelpScene" });
  }

  init(data) {
    this.fans = [];
    data.fans.forEach((fan) => {
      const newFan = new Fan(this, fan.x, fan.y);
      newFan.offset = fan.offset;
      newFan.shirt = fan.shirt;
      newFan.skin = fan.skin;
      this.fans.push(newFan);
    });

    this.music = data.music;
  }

  preload() {}

  create() {
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

    const title = "Instructions";
    this.shadow = this.add
      .text(800 / 2 + 5, 60 + 5, title, {
        fontFamily: "awesome",
        fontSize: 128,
        color: "#000000",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.title = this.add
      .text(800 / 2, 60, title, {
        fontFamily: "awesome",
        fontSize: 128,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(
        400,
        300,
        "The circus is in town and you and your\nunicycle are the main attraction!\n" +
          "Keep the fans happy;\nThe more airtime you get, the louder they cheer!\n\n" +
          "Use the 'A' & 'D' keys to move\n" +
          "Use the 'LEFT' & 'RIGHT' arrows to balance\n" +
          "Hold 'W' to time a big bounce,\n Press 'S' for a little hop.\n\n" +
          "Keep your balance and don't hit your head!\n" +
          "Press 'Space' to start!",
        {
          fontFamily: "awesome",
          fontSize: 32,
          color: "#ffffff",
          align: "center",
        },
      )
      .setOrigin(0.5, 0.5);

    this.input.keyboard.on("keydown-M", () => {
      this.music.mute = !this.music.mute;
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    });

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.start("GameScene", {
          fans: this.fans,
          music: this.music,
        });
      },
    );
  }

  update(time, delta) {
    this.fans.forEach((fan) => {
      fan.update(time, delta, 0.5);
    });
  }
}
