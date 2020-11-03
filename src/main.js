import Phaser from "./library/phaser.js";
import Game from "./scenes/Game.js";
import GameOver from "./scenes/GameOver.js";

console.log("Connected!");
console.dir(Phaser);

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  scene: [Game, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
      },
      debug: true,
    },
  },
});
