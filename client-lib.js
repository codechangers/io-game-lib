const Colyseus = require('colyseus.js');
const gameConfig = require('./config.json');
const endpoint =
  window.location.hostname === 'localhost'
    ? `ws://localhost:${gameConfig.serverDevPort}` // development (local)
    : `${window.location.protocol.replace('http', 'ws')}//${
        window.location.hostname
      }`; // production (remote)
const colyseus = new Colyseus.Client(endpoint);

module.exports = class ClientLib {
  constructor() {
    this.game = null;
    this.keys = null;
  }

  // Bind the Game and setup initial state.
  setup(
    game // game.js/Game: Your Game!
  ) {
    this.game = game;
    game.room = null;
    game.roomJoined = false;
    game.cursors = null;
    game.width = 0;
    game.height = 0;
  }

  // Set the size of the game.
  setSize(
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
  loadImage(
    name, // string: The name of the image.
    path // string: Path to the file inside the asset folder.
  ) {
    return this.game.load.image(name, `asset/${path}`);
  }

  // Connect to the Server.
  connect() {
    const { game } = this;
    game.room = colyseus.join('main', {});
    game.room.onJoin.add(() => {
      game.roomJoined = true;
    });
  }

  // Create a new set of Characters.
  addCharacters(
    type // string: The type of characters.
  ) {
    this.game[type] = {};
  }

  // Listen to Characters on the server.
  getCharacters(
    type, // string: The type of characters.
    onAdd = function () {}, // function: This will get run when a character is added.
    onRemove = function () {}, // function: This will get run when a character is removed.
    onUpdate = function () {} // function: This will get run when a character is updated.
  ) {
    const { game } = this;
    game.room.listen(`${type}/:id`, function (change) {
      if (change.operation == 'add') {
        const { id, x, y } = change.value;
        game[type][id] = {
          sprite: game.add.sprite(x, y, type),
          id,
        };
        onAdd(game[type][id], change.value);
      } else if (change.operation == 'remove') {
        const { id } = change.path;
        game[type][id].sprite.destroy();
        delete game[type][id];
        onRemove(id);
      }
    });
    game.room.listen(`${type}/:id/:attribute`, function (change) {
      if (change.operation == 'replace') {
        const { id, attribute } = change.path;
        if (attribute == 'x' || attribute == 'y') {
          game[type][id].sprite[attribute] = change.value;
        }
        onUpdate(id, attribute, change.value);
      }
    });
  }

  // Listen for keyboard input!
  setupKeys(
    keys // object: A bunch of Phaser keycodes!
  ) {
    this.keys = this.game.input.keyboard.addKeys(keys);
  }

  // Get Current Key Inputs.
  getKeysDown() {
    const keysDown = {};
    for (let key in this.keys) {
      keysDown[key] = this.keys[key].isDown;
    }
    return keysDown;
  }

  // Tell you if messages are ready!
  canSend() {
    return this.game.roomJoined;
  }

  // Send an Action Command to the Server.
  sendAction(
    action // string: The action!
  ) {
    this.game.room.send({ action });
  }

  // Draw the background of the game.
  drawBackground(
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

  // Make the camera follow a sprite in the game.
  cameraFollow(
    sprite // Phaser.sprite: The sprite you would like to have the camera follow.
  ) {
    this.game.cameras.main.startFollow(sprite);
  }

  // Bind the camera to an area with a specific size.
  cameraBounds(
    width = this.game.width, // The width of the area the camera is bound to.
    height = this.game.height // The height of the area the camera is bound to.
  ) {
    this.game.cameras.main.setBounds(0, 0, width, height);
  }
};
