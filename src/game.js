/* -- CodeChangers io-game-lib 2020 --
 * This file contains the source code for global game logic. */

/* =========================
 * ==== Client Methods: ====
 * ========================= */

// Set the size of the game.
function setSize(
  width, // The width of the game.
  height // The height of the game.
) {
  const { game } = this;
  if (width > 0) {
    game.width = width;
  }
  if (height > 0) {
    game.height = height;
  }
}

// Load an Image into the Game.
function loadImage(
  name, // string: The name of the image.
  path // string: Path to the file inside the asset folder.
) {
  return this.game.load.image(name, `asset/${path}`);
}

// Listen for keyboard input!
function setupKeys(
  keys // object: A bunch of Phaser keycodes!
) {
  const { game, connectFuncs } = this;
  if (game.roomJoined) {
    this.keys = this.game.input.keyboard.addKeys(keys);
  } else {
    connectFuncs['setupKeys'] = [keys];
  }
}

// Get Current Key Inputs.
function getKeysDown() {
  const keysDown = {};
  for (let key in this.keys) {
    keysDown[key] = this.keys[key].isDown;
  }
  return keysDown;
}

// Make the camera follow a sprite in the game.
function cameraFollow(
  sprite // Phaser.sprite: The sprite you would like to have the camera follow.
) {
  this.game.cameras.main.startFollow(sprite);
}

// Bind the camera to an area with a specific size.
function cameraBounds(
  width = this.game.width, // The width of the area the camera is bound to.
  height = this.game.height // The height of the area the camera is bound to.
) {
  this.game.cameras.main.setBounds(0, 0, width, height);
}

const client = {
  setSize,
  loadImage,
  setupKeys,
  getKeysDown,
  cameraFollow,
  cameraBounds,
};

module.exports = { client };
