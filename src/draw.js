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
        const flr = game.add.sprite(width * i, height * j, img);
        flr.setScale(scale);
        flr.depth = 0;
      }
    }
  }
}

// Create a square
function createSquare(
  width, // number: The width of the square you want to create.
  height, // number: The height of the square you want to create.
  x, // number: The starting x position of the top left of your square.
  y, // number: The starting y position of the top left of your square.
  color, // string: The color of your square.
  depth = 0 // number: The ranking used to decide what is drawn over and below the sqare.
) {
  const rect = new Phaser.Geom.Rectangle(x, y, width, height);
  const graphics = this.game.add.graphics({
    fillStyle: { color: `0x${color}` },
    depth,
  });
  graphics.fillRectShape(rect);
  return graphics;
}

// Update a previously drawn square.
function updateSquare(width, height, x, y, color, graphics) {
  const rect = new Phaser.Geom.Rectangle(width, height, x, y);
  graphics.clear();
  graphics.fillStyle = { color: `0x${color}` };
  graphics.fillRectShape(rect);
}

// Create a sprite
function createSprite(
  image, // string: The name of the image to make a sprite with.
  x, // number: The x position of your sprite
  y, // number: The y position of your sprite
  scale = 1 // number: The scale of the sprite, ie. 0.5 for half size.
) {
  let sprite = this.game.add.sprite(x, y, image);
  sprite.setScale(scale);
  return sprite;
}

// Get the size of an image at a certain scale.
function getSpriteSize(
  image, // string: The name of the image to make a sprite with.
  scale = 1 // number: The scale of the sprite, ie. 0.5 for half size.
) {
  let sprite = this.game.add.sprite(-100, -100, image);
  let { width, height } = sprite;
  sprite.destroy();
  width *= scale;
  height *= scale;
  return { width, height };
}

const client = {
  drawBackground,
  createSquare,
  updateSquare,
  createSprite,
  getSpriteSize,
};

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

// Get the size of an object.
function getSize(
  type // string: The type of object you want the size of.
) {
  const { sizes } = this.game;
  let s = { width: 0, height: 0 };
  if (Object.keys(sizes).includes(type)) s = sizes[type];
  return s;
}

const server = { setupBoard, getSize };

module.exports = { client, server };
