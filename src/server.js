/* -- CodeChangers io-game-lib 2020 --
 * This file contains the io game server library class definition. */

const { serverMethods, linkMethods, version } = require('./helpers');

// This is the Library of Server side functionallity.
module.exports = class ServerLib {
  constructor() {
    this.version = version;
    this.game = null;
    this.counts = {};
    this.boardWidth = 500;
    this.boardHeight = 500;
    this.defaultActions = {};
    this.items = {};
  }

  // Bind the Game and setup initial state.
  setup(
    game // game.js/Game: Your Game!
  ) {
    this.game = game;
    this.game.setState({ board: {} });
    this.game.sizes = {};
    this.game.shapes = {};
    this.game.barriers = {};
    linkMethods(this, serverMethods);
    this.setDefaultActions();
    this.runGameLoop();
  }
};
