import Phaser from "./library/phaser.js";
import Game from "./scenes/Game.js";

console.log("Connected!");
console.dir(Phaser);

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  scene: Game,
  physics: {
    gravity: {
      y: 200,
    },
    debug: true,
  },
});
