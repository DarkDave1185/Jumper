import Phaser from "../library/phaser.js";
export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    //load the background image
    this.load.image("background", "assets/bg_layer1.png");
    // load the platform image
    this.load.image("platform", "assets/ground_grass.png");
    // load character images
    this.load.image("bunny-stand", "assets/bunny1_stand.png");
  }
  create() {
    //half canvas to make sure centered
    this.add.image(240, 320, "background");
    // add a platform image in the middle(*STATIC IMAGE*)
    /* this.add.image(240, 320, "platform").setScale(0.5); */
    // add a platform STATIC PHYSICS BASED image in the middle(*PHYSICS BASED*)
    /* this.physics.add.image(240, 320, "platform").setScale(0.5); */
    /* this.physics.add.staticImage(240, 320, "platform").setScale(0.5); */

    // create the group
    let platforms = this.physics.add.staticGroup();

    // then create 5 platforms from the group
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = platforms.create(x, y, "platform");
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    // create a bunny sprite
    this.physics.add.sprite(240, 320, "bunny-stand").setScale(0.5);
  }
}
