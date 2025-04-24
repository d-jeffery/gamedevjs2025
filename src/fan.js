export class Fan {
  constructor(scene, x, y) {
    const skins = [0xfcd380, 0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524];
    this.skin = skins[Math.floor(Math.random() * skins.length)];
    this.shirt = Math.random() * 4294967295;

    this.x = x;
    this.y = this.origin = y;
    this.offset = Math.random() * 100;
    this.scene = scene;

    this.graphic = this.scene.add.graphics();
    this.draw();
  }

  draw() {
    this.graphic.clear();

    this.graphic.alpha = 1;
    this.graphic.fillStyle(this.shirt, 1);
    this.graphic.lineStyle(2, this.shirt, 1);
    this.graphic.fillRoundedRect(this.x - 20, this.y, 40, 60);
    this.graphic.fillStyle(this.skin, 1);
    this.graphic.lineStyle(2, this.skin, 1);
    this.graphic.fillCircle(this.x, this.y, 15);
  }

  update(time, delta, score) {
    this.y = Phaser.Math.Linear(
      this.origin,
      this.origin - 10,
      Math.cos(time / 100 + this.offset) * (Math.min(score, 2500) / 1000),
    );

    this.graphic.clear();
    this.draw();
  }
}
