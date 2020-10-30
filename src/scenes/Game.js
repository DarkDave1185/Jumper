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
  }
  create() {
    //half canvaas to make sure centered
    this.add.image(240, 320, "background");
    // add a platform image in the middle(*STATIC IMAGE*)
    this.add.image(240, 320, "platform").setScale(0.5);
    // add a platform STATIC PHYSICS BASED image in the middle(*PHYSICS BASED*)
    /* this.physics.add.staticImage(240, 320, "platform").setScale(0.5); */
  }
}
