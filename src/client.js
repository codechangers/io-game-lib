/* -- CodeChangers io-game-lib 2020 --
 * This file contains the io game client library class definition. */

const Colyseus = require('colyseus.js');
const { clientMethods, linkMethods } = require('./helpers');

/* eslint-disable */
const gameConfig = require('../config.json');
const endpoint =
  window.location.hostname === 'localhost'
    ? `ws://localhost:${gameConfig.serverDevPort}` // development (local)
    : `${window.location.protocol.replace('http', 'ws')}//${
        window.location.hostname
      }`; // production (remote)
/* eslint-enable */

// This is the Library of Client side functionallity.
module.exports = class ClientLib {
  constructor() {
    this.game = null;
    this.keys = null;
    this.connectEvents = {};
    this.colyseus = new Colyseus.Client(endpoint);
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
    game.scales = {};
    game.front_layer = game.add.group();
    // ADDS AN EVENT TO ALLOW FOR CLICKING
    document.addEventListener('click', function (e) {
      if (
        !e.path.includes(document.getElementById('input-overlay')) &&
        game.click
      ) {
        const moveX = e.clientX - window.innerWidth / 2;
        const moveY = e.clientY - window.innerHeight / 2;
        game.click(
          game.cameras.main.scrollX + window.innerWidth / 2 + moveX,
          game.cameras.main.scrollY + window.innerHeight / 2 + moveY
        );
      }
    });
    // ADDS AN EVENT TO ALLOW FOR MOUSEMOVE
    document.addEventListener('mousemove', function (e) {
      if (game.mousemove) {
        const moveX = e.clientX - window.innerWidth / 2;
        const moveY = e.clientY - window.innerHeight / 2;
        game.mousemove(
          game.cameras.main.scrollX + window.innerWidth / 2 + moveX,
          game.cameras.main.scrollY + window.innerHeight / 2 + moveY
        );
      }
    });
    linkMethods(this, clientMethods);
  }
};
