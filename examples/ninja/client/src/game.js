const Phaser = require('phaser');
const ClientLib = require('../../../../src/client');
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
    g.addCharacters('trees');
  }

  preload() {
    g.loadImage('players', 'logo.png');
    g.loadImage('trees', 'tree.png');
  }

  create() {
    g.connect();
    g.setupKeys(keys);
    g.getCharacters(
      'players',
      (player) => player.sprite.setScale(0.5) // On Add
    );
    g.getCharacters('trees', (tree) => console.log('ADDED'));
  }

  click(x, y) {
    g.sendAction('click', { x, y });
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
