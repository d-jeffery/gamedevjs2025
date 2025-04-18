import randomColor from "randomcolor"

export class Fan {
    constructor(scene, x, y) {
        const graphics = scene.add.graphics();

        const shirt = Math.random() * 4294967295;

        graphics.fillStyle(shirt, 1);

        graphics.lineStyle(2, shirt, 1);

        graphics.fillRoundedRect(x-20, y, 40, 60)

        graphics.fillStyle(0xfcd380, 1);

        graphics.lineStyle(2, 0xfcd380, 1);

        graphics.fillCircle(x, y, 15)

        this.scene = scene;
    }
}
