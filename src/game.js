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
  const { game, addConnectEvent } = this;
  if (game.roomJoined) {
    this.keys = this.game.input.keyboard.addKeys(keys);
  } else {
    addConnectEvent('setupKeys', [keys]);
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

/* =========================
 * ==== Server Methods: ====
 * ========================= */

// Setup the edge boundaries for your game.
function setBounds(
  width, // number: How wide the game is.
  height // number: How tall the game is.
) {
  if (width > 0) {
    this.game.gameWidth = width;
  }
  if (height > 0) {
    this.game.gameHeight = height;
  }
}

// Check if a move runs into the game bounds.
function checkBounds(
  object, // object: The game object you want to move.
  axis, // string: x or y axis of movement.
  distance // number: How far to move along the given axis.
) {
  const { gameWidth, gameHeight } = this.game;
  let validMove = true;
  let fallbackPos = -1;
  if (gameWidth && gameHeight) {
    const gDim = axis === 'x' ? gameWidth : gameHeight;
    const oDim = axis === 'x' ? object.width : object.height;
    const offSet = axis === 'x' ? object.width / 2 : object.height / 2;
    if (object[axis] - offSet + distance < 0) {
      // Left/Top of Boundries
      validMove = false;
      fallbackPos = offSet;
    } else if (object[axis] - offSet + distance + oDim > gDim) {
      // Right/Bottom of Boundries
      validMove = false;
      fallbackPos = gDim - oDim + offSet;
    }
  }
  return { validMove, fallbackPos };
}

// Move an in game object within the bounds and barriers of the game.
function move(
  object, // object: The game object you want to move.
  axis, // string: x or y axis of movement.
  distance // number: How far to move along the given axis.
) {
  let validMove = true;
  let fallbackPos = -1;
  // Check Game Boundries
  const boundsMove = this.checkBounds(object, axis, distance);
  if (!boundsMove.validMove) {
    validMove = false;
    fallbackPos = boundsMove.fallbackPos;
  }
  // Check for Barriers
  const barrierMove = this.checkBarriers(object, axis, distance);
  if (!barrierMove.validMove) {
    validMove = false;
    fallbackPos = barrierMove.fallbackPos;
  }
  // Move Object to valid position.
  if (validMove) {
    object[axis] += distance;
  } else {
    object[axis] = fallbackPos;
  }
}

// Setup the default/implicit game library actions.
function setDefaultActions() {
  const { state, sizes } = this.game;
  this.defaultActions = {
    setCharacterSize: (data) => {
      const { type, width, height } = data;
      sizes[type] = { width, height };
      // Set sizes of previously definied characters
      Object.values(state[type]).forEach((character) => {
        character.width = width;
        character.height = height;
      });
    },
  };
}

// Run an iteration loop on the server that calls your onUpdate method.
function runGameLoop() {
  const self = this;
  let prev = Date.now();
  function iter() {
    const now = Date.now();
    const dt = now - prev;
    if (dt > 0) {
      self.game.onUpdate(dt);
      prev = now;
    }
    setImmediate(iter);
  }
  if (this.game.onUpdate) {
    setImmediate(iter);
  }
}

const server = {
  setBounds,
  checkBounds,
  move,
  setDefaultActions,
  runGameLoop,
};

module.exports = { client, server };
