import Phaser from "phaser";
import { Fan } from "./fan.js";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    this.load.font("awesome", "./assets/Awesome.ttf");
    this.load.audio("theme", ["./assets/Entry_of_Gladiators.mp3"]);
    this.load.audio("ouch", ["./assets/ouch-sound-effect.mp3"]);
  }

  create() {
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        this.add.rectangle(80 * i + 40, 300, 80, 600, 0xffff00, 0.25);
      } else {
        this.add.rectangle(80 * i + 40, 300, 80, 600, 0xff0000, 0.25);
      }
    }
    this.add.rectangle(400, 560, 800, 80, 0x351e10, 1);

    this.fans = [];
    // Generate fans
    for (let i = 0; i < 14; i++) {
      const fan = new Fan(this, 75 + 50 * i, 500);
      this.fans.push(fan);
    }
    for (let i = 0; i < 13; i++) {
      const fan = new Fan(this, 100 + 50 * i, 550);
      this.fans.push(fan);
    }

    const title = "Ride the\nLine!";

    this.shadow = this.add
      .text(800 / 2 + 5, 140 + 5, title, {
        fontFamily: "awesome",
        fontSize: 128,
        color: "#000000",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.title = this.add
      .text(800 / 2, 140, title, {
        fontFamily: "awesome",
        fontSize: 128,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    const start = "Press 'Space' to Start!";

    this.add
      .text(800 / 2, 300, start, {
        fontFamily: "awesome",
        fontSize: 48,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    const help = "Press 'H' for Help!";

    this.add
      .text(800 / 2, 360, help, {
        fontFamily: "awesome",
        fontSize: 48,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    const mute = "Press 'M' to mute the music!";

    this.add
      .text(800 / 2, 420, mute, {
        fontFamily: "awesome",
        fontSize: 48,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.music = this.sound.add("theme", {
      volume: 0.25,
      loop: true,
    });
    this.music.play();
    this.sound.pauseOnBlur = true;

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

    this.input.keyboard.once("keydown-H", () => {
      this.scene.start("HelpScene", {
        fans: this.fans,
        music: this.music,
      });
    });
  }

  update(time, delta) {
    this.fans.forEach((fan) => {
      fan.update(time, delta, 0.5);
    });

    const x = Math.cos(time / 500) / 10;
    const y = 140 + Math.sin(time / 200) * 10;
    this.title.setRotation(x);
    this.title.setY(y);
    this.shadow.setRotation(x);
    this.shadow.setY(y + 5);
  }
}
