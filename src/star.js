import Phaser from "phaser";

export class Star {
  constructor(scene, x, y) {
    const Body = Phaser.Physics.Matter.Matter.Body;

    const group = Body.nextGroup(true);

    this.body = scene.matter.add.circle(x, y, 10, {
      collisionFilter: { group: group },
      label: "star",
      frictionAir: 0.2,
    });

    this.scene = scene;
  }
}
