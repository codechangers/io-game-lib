/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for drawing shapes and images in an io-game. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Draw the background of the game.
function drawBackground(
  img, // string: The background image.
  scale = 1, // number: Scale of the background image.
  gameW = this.game.width, // number: The width of your game.
  gameH = this.game.height // number: The height of your game.
) {
  const { game } = this;
  const floor = game.add.sprite(0, 0, img);
  floor.setScale(scale);
  floor.depth = 0;
  let { width, height } = floor;
  width *= scale;
  height *= scale;
  for (let i = 0; i <= Math.floor(gameW / width) + 1; i++) {
    for (let j = 0; j <= Math.floor(gameH / height) + 1; j++) {
      if (i > 0 || j > 0) {
        const floor = game.add.sprite(width * i, height * j, img);
        floor.setScale(scale);
        floor.depth = 0;
      }
    }
  }
}

// Create a square
function createSquare(
  width, // The width of the square you want to create
  height, // The height of the square you want to create
  x, // The starting x position of the top left of your square
  y, // The starting y position of the top left of your square
  color // The color of your square
) {
  var rect = new Phaser.Geom.Rectangle(width, height, x, y);
  var graphics = this.game.add.graphics({
    fillStyle: { color: `0x${color}` },
  });
  graphics.fillRectShape(rect);
}

// Create a sprite
function createSprite(
  type, // The name of your sprite
  x, // The x position of your sprite
  y, // The y position of your sprite
  scale = 1 // The scale or size they want their sprite to be
) {
  let sprite = this.game.add.sprite(x, y, type);
  sprite.setScale(scale);
  return sprite;
}

const client = { drawBackground, createSquare, createSprite };

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Creates their board for them with boundaries
function setupBoard(
  width, // int: The width of their board.
  height, // int: The height of their board.
  color // string: Hex value of the color of their board.
) {
  this.boardWidth = width;
  this.boardHeight = height;
  this.game.state.board.board = { width, height, color };
}

const server = { setupBoard };

module.exports = { client, server };