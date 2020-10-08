const Phaser = require('phaser');
const ClientLib = require('./client-lib');
const g = new ClientLib();

const keyCodes = Phaser.Input.Keyboard.KeyCodes;
const keys = {
  w: keyCodes.W,
  s: keyCodes.S,
  a: keyCodes.A,
  d: keyCodes.D,
  up: keyCodes.UP,
  down: keyCodes.DOWN,
  left: keyCodes.LEFT,
  right: keyCodes.RIGHT,
};

module.exports = class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    g.setup(this);
    g.addCharacters('players');
  }

  preload() {
    g.loadImage('players', 'logo.png');
  }

  create() {
    g.connect();
    g.setupKeys(keys);
    g.getCharacters(
      'players',
      (player) => player.sprite.setScale(0.5) // On Add
    );
  }

  update() {
    if (g.canSend()) {
      const { up, down, left, right, w, a, s, d } = g.getKeysDown();
      if (up || w) g.sendAction('moveUp');
      if (down || s) g.sendAction('moveDown');
      if (left || a) g.sendAction('moveLeft');
      if (right || d) g.sendAction('moveRight');
    }
  }
};
