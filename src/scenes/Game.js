import Phaser from "../library/phaser.js";
import Carrot from "../game/Carrot.js";

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;
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

    this.load.image("carrot", "assets/carrot.png");

    this.cursors = this.input.keyboard.createCursorKeys();
  }
  create() {
    //half canvas to make sure centered
    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    // add a platform image in the middle(*STATIC IMAGE*)
    /* this.add.image(240, 320, "platform").setScale(0.5); */
    // add a platform STATIC PHYSICS BASED image in the middle(*PHYSICS BASED*)
    /* this.physics.add.image(240, 320, "platform").setScale(0.5); */
    /* this.physics.add.staticImage(240, 320, "platform").setScale(0.5); */

    // create the group
    this.platforms = this.physics.add.staticGroup();

    // then create 5 platforms from the group
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "platform");
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    // create a bunny sprite
    this.player = this.physics.add
      .sprite(240, 320, "bunny-stand")
      .setScale(0.5);
    // create a carrot
    this.carrots = this.physics.add.group({
      classType: Carrot,
    });
    //blocks carrot group
    /* this.carrots.get(240, 320, "carrot"); */
    this.add.existing(this.carrots);
    //test carrot
    /* this.carrot.get(240, 320, "carrot"); */
    //physics player and platform
    this.physics.add.collider(this.platforms, this.player);
    //physics carrot and platform
    this.physics.add.collider(this.platforms, this.carrots);
    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this
    );

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.cameras.main.startFollow(this.player);
    // set the horizontal dead zone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5);
  }
  update() {
    // find out if the player's physics body is touching something below it
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      // this makes the bunny jump straight up
      this.player.setVelocityY(-300);
    }

    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
        // create a carrot above the platform being reused
        this.addCarrotAbove(platform);
      }
    });

    // left and right input logic
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      // stop movement if not left or right
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);
  }
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;
    /** @type {Phaser.Physics.Arcade.Group} */
    const carrot = this.carrots.get(sprite.x, y, "carrot");

    this.add.existing(carrot);
    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height);
    return carrot;
  }
  /**
   * @param {Phaser.GAme Object.Sprite} sprite
   */
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, "carrot");
    //make active and visible
    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot);
    carrot.body.setSize(Carrot.width, carrot.height);
    // make sure body is enabed
    this.physics.world.enable(carrot);
    return carrot;
  }
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectCarrot(player, carrot) {
    //hide carrot
    this.carrots.killAndHide(carrot);
    //disable carrot
    this.physics.world.disableBody(carrot.body);
  }
}
